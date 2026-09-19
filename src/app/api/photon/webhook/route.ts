import { getThread, setThread } from "@/lib/conversation";
import { pushRoom } from "@/lib/live-room";
import { handleInboundPhoton } from "@/lib/photon";

/**
 * Photon Spectrum can deliver inbound iMessages here.
 * Verify SPECTRUM_WEBHOOK_SECRET in production before trusting the body.
 */
export async function POST(request: Request) {
  const secret = process.env.SPECTRUM_WEBHOOK_SECRET;
  const header = request.headers.get("x-spectrum-signature");
  if (secret && header !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    text?: string;
    sender?: string;
    spaceId?: string;
    encounterId?: string;
    attachments?: Array<{ mimeType?: string; data?: string }>;
  };

  const key = body.sender || body.spaceId || "webhook";
  const thread = getThread(key);
  const attachment = body.attachments?.[0];
  pushRoom({
    from: "resident",
    text: body.text || (attachment ? "Sent a photo" : ""),
    handle: key,
  });

  const reply = await handleInboundPhoton({
    text: body.text ?? "",
    sender: body.sender,
    spaceId: body.spaceId,
    encounterId: body.encounterId,
    imageBase64: attachment?.data,
    mimeType: attachment?.mimeType,
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

  return Response.json({
    replies: reply.messages.map((text) => ({ type: "text", text })),
    photon: reply.photon,
    analysis: reply.analysis,
    report: reply.report,
    followUp: reply.followUp,
  });
}
