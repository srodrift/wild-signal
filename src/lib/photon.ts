/**
 * Photon / Spectrum adapter.
 *
 * Chat is the product because the resident is already holding Messages —
 * often with a dog, a stroller, or a blurry night photo. Photon is how
 * WildSignal uses the native iMessage surface instead of asking them to
 * install an app.
 *
 * Native features we actually emit (see AgentReply.photon):
 * - tapback on the inbound photo
 * - gentle / slam message effect
 * - poll: "Are you currently safe?"
 * - rich link to the official agency page
 * - contact card for dispatch
 * - live iMessage App card for the responder packet
 * - private group renamed "WildSignal · private response"
 *
 * When SPECTRUM_PROJECT_ID and SPECTRUM_PROJECT_SECRET are set:
 *
 *   import { Spectrum, poll, app } from "spectrum-ts";
 *   import { contacts } from "spectrum-ts";
 *   import { effect, imessage } from "spectrum-ts/providers/imessage";
 *
 *   const appServer = await Spectrum({
 *     projectId: process.env.SPECTRUM_PROJECT_ID!,
 *     projectSecret: process.env.SPECTRUM_PROJECT_SECRET!,
 *     providers: [imessage.config()],
 *   });
 *
 *   for await (const [space, message] of appServer.messages) {
 *     await space.responding(async () => {
 *       const reply = await handleInboundPhoton({ text: ... });
 *       if (reply.photon.tapback) await message.react("emphasized");
 *       for (const text of reply.messages) {
 *         await space.send(
 *           effect(text, imessage.effect.message[reply.photon.effect ?? "gentle"]),
 *         );
 *       }
 *       if (reply.photon.poll) {
 *         await space.send(poll(reply.photon.poll.title, reply.photon.poll.options));
 *       }
 *       if (reply.photon.appCard) {
 *         await space.send(app(reply.photon.appCard.url, { live: true }));
 *       }
 *     });
 *   }
 */

import {
  composeAfterSafety,
  composeOpening,
  composeReport,
  composeSceneReply,
  composeTalk,
  interpretEncounter,
  parseSafetyReply,
} from "@/lib/agent";
import { isSceneTap, looksLikePlace, sceneTapsFor } from "@/lib/coach";
import { looksLikeEncounter } from "@/lib/talk";
import type { AgentReply, ConversationPhase, SceneAnalysis } from "@/lib/types";

export interface PhotonInbound {
  spaceId?: string;
  sender?: string;
  text: string;
  encounterId?: string;
  imageBase64?: string;
  mimeType?: string;
  phase?: ConversationPhase;
  analysis?: SceneAnalysis;
  neighborhood?: string;
}

export async function handleInboundPhoton(
  inbound: PhotonInbound,
): Promise<AgentReply> {
  const phase = inbound.phase ?? "idle";

  const hasImage = Boolean(inbound.imageBase64);
  const chatting =
    (phase === "idle" || phase === "talk" || !inbound.analysis) &&
    !inbound.encounterId &&
    !looksLikeEncounter(inbound.text, hasImage);

  if (chatting) {
    return composeTalk(inbound.text);
  }

  if (phase === "idle" || phase === "talk" || !inbound.analysis) {
    const analysis = await interpretEncounter({
      text: inbound.text,
      encounterId: inbound.encounterId,
      imageBase64: inbound.imageBase64,
      mimeType: inbound.mimeType,
    });
    return composeOpening(analysis);
  }

  if (phase === "scene") {
    const safe = parseSafetyReply(inbound.text);
    if (safe !== null) {
      return composeAfterSafety(inbound.analysis, safe);
    }
    if (looksLikePlace(inbound.text)) {
      return composeReport(inbound.analysis, {
        neighborhood: inbound.neighborhood ?? inbound.text,
        notes: inbound.text,
        witnessSafe: true,
      });
    }
    if (isSceneTap(inbound.text, sceneTapsFor(inbound.analysis))) {
      return composeSceneReply(inbound.analysis, inbound.text);
    }
    return composeSceneReply(inbound.analysis, inbound.text);
  }

  if (phase === "triage") {
    const safe = parseSafetyReply(inbound.text);
    if (safe === null) {
      return composeAfterSafety(inbound.analysis, true);
    }
    return composeAfterSafety(inbound.analysis, safe);
  }

  if (phase === "details") {
    return composeReport(inbound.analysis, {
      neighborhood: inbound.neighborhood ?? inbound.text,
      notes: inbound.text,
      witnessSafe: true,
    });
  }

  return composeReport(inbound.analysis, {
    neighborhood: inbound.neighborhood,
    notes: inbound.text,
    witnessSafe: true,
  });
}

export function photonConfigured() {
  return Boolean(
    process.env.SPECTRUM_PROJECT_ID && process.env.SPECTRUM_PROJECT_SECRET,
  );
}

export function photonFeatureList(reply: AgentReply) {
  const features: string[] = ["typing indicator", "threaded reply"];
  if (reply.photon.tapback) features.push(`tapback · ${reply.photon.tapback}`);
  if (reply.photon.effect) features.push(`effect · ${reply.photon.effect}`);
  if (reply.photon.poll) features.push("poll");
  if (reply.photon.richLink) features.push("rich link");
  if (reply.photon.contact) features.push("contact card");
  if (reply.photon.appCard) features.push("iMessage App card");
  if (reply.photon.group) features.push("private response group");
  return features;
}
