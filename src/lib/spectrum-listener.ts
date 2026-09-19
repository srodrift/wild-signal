import { handleInboundPhoton } from "@/lib/photon";
import { getThread, setThread } from "@/lib/conversation";
import { pushRoom } from "@/lib/live-room";
import type { AgentReply } from "@/lib/types";

type LooseContent = {
  type?: string;
  text?: string;
  markdown?: string;
  mimeType?: string;
  options?: Array<{ text?: string; selected?: boolean }>;
  read?: () => Promise<Buffer>;
};

type LooseMessage = {
  direction?: string;
  content?: LooseContent;
  sender?: { id?: string };
  react?: (name: string) => Promise<unknown>;
  read?: () => Promise<unknown>;
};

type LooseSpace = {
  id?: string;
  responding: (fn: () => Promise<void>) => Promise<void>;
  send: (content: unknown) => Promise<unknown>;
};

let started = false;
let listening = false;
let lastError: string | null = null;

export function photonListening() {
  return listening;
}

export function photonListenError() {
  return lastError;
}

async function inboundText(message: LooseMessage) {
  const content = message.content;
  if (!content) return { text: "", imageBase64: undefined, mimeType: undefined };
  if (content.type === "text") {
    return { text: content.text ?? "", imageBase64: undefined, mimeType: undefined };
  }
  if (content.type === "markdown") {
    return { text: content.markdown ?? "", imageBase64: undefined, mimeType: undefined };
  }
  if (content.type === "poll") {
    const picked = content.options?.find((option) => option.selected)?.text;
    return { text: picked ?? "", imageBase64: undefined, mimeType: undefined };
  }
  if (content.type === "attachment" && content.read) {
    try {
      const buffer = await content.read();
      return {
        text: "",
        imageBase64: buffer.toString("base64"),
        mimeType: content.mimeType ?? "image/jpeg",
      };
    } catch {
      return { text: "", imageBase64: undefined, mimeType: undefined };
    }
  }
  return { text: content.text ?? "", imageBase64: undefined, mimeType: undefined };
}

async function sendReply(space: LooseSpace, message: LooseMessage, reply: AgentReply) {
  const { poll, app, contact } = await import("spectrum-ts");
  const { effect, imessage } = await import("spectrum-ts/providers/imessage");

  if (reply.photon.tapback && message.react) {
    try {
      await message.react("emphasized");
    } catch {
      /* tapback is nice-to-have */
    }
  }

  for (const text of reply.messages) {
    const fx = reply.photon.effect === "slam" ? "slam" : "gentle";
    try {
      await space.send(effect(text, imessage.effect.message[fx]));
    } catch {
      await space.send(text);
    }
  }

  if (reply.photon.poll) {
    try {
      await space.send(poll(reply.photon.poll.title, reply.photon.poll.options));
    } catch {
      await space.send(`${reply.photon.poll.title} Reply ${reply.photon.poll.options.join(" / ")}`);
    }
  }

  if (reply.photon.richLink?.url) {
    try {
      await space.send(reply.photon.richLink.url);
    } catch {
      /* ignore */
    }
  }

  if (reply.photon.contact) {
    try {
      await space.send(
        contact({
          firstName: reply.photon.contact.name,
          phones: reply.photon.contact.phone ? [reply.photon.contact.phone] : [],
        }),
      );
    } catch {
      if (reply.photon.contact.phone) {
        await space.send(`Call ${reply.photon.contact.name}: ${reply.photon.contact.phone}`);
      }
    }
  }

  if (reply.photon.appCard?.url) {
    try {
      await space.send(app(reply.photon.appCard.url, { live: Boolean(reply.photon.appCard.live) }));
    } catch {
      /* ignore */
    }
  }
}

export async function startPhotonListener() {
  if (started) return;
  started = true;

  if (!process.env.SPECTRUM_PROJECT_ID || !process.env.SPECTRUM_PROJECT_SECRET) {
    lastError = "Photon credentials missing";
    return;
  }

  try {
    const { Spectrum } = await import("spectrum-ts");
    const { imessage } = await import("spectrum-ts/providers/imessage");

    const appServer = await Spectrum({
      projectId: process.env.SPECTRUM_PROJECT_ID,
      projectSecret: process.env.SPECTRUM_PROJECT_SECRET,
      providers: [imessage.config()],
    });

    listening = true;
    lastError = null;
    console.log("[wildsignal] Photon iMessage line is listening");

    void (async () => {
      for await (const [space, message] of appServer.messages as AsyncIterable<
        [LooseSpace, LooseMessage]
      >) {
        if (message.direction && message.direction !== "inbound") continue;
        const inbound = await inboundText(message);
        if (!inbound.text && !inbound.imageBase64) continue;

        const key = message.sender?.id || space.id || "unknown";
        const thread = getThread(key);
        pushRoom({
          from: "resident",
          text: inbound.text || (inbound.imageBase64 ? "Sent a photo" : ""),
          handle: key,
        });

        try {
          await space.responding(async () => {
            const reply = await handleInboundPhoton({
              text: inbound.text,
              sender: message.sender?.id,
              spaceId: space.id,
              imageBase64: inbound.imageBase64,
              mimeType: inbound.mimeType,
              phase: thread.phase,
              analysis: thread.analysis,
              neighborhood: thread.neighborhood,
            });
            setThread(key, {
              phase: reply.followUp.phase,
              analysis: reply.analysis,
              neighborhood: reply.report?.neighborhoodHint ?? thread.neighborhood,
            });
            for (const text of reply.messages) {
              pushRoom({ from: "wildsignal", text, handle: key });
            }
            await sendReply(space, message, reply);
          });
        } catch (error) {
          lastError = error instanceof Error ? error.message : "Photon reply failed";
          console.error("[wildsignal] Photon reply failed", error);
        }
      }
    })();
  } catch (error) {
    listening = false;
    lastError = error instanceof Error ? error.message : "Photon listener failed";
    console.error("[wildsignal] Photon listener failed", error);
  }
}
