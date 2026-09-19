import { handleInboundPhoton } from "@/lib/photon";
import { geminiConfigured } from "@/lib/gemini";
import { photonConfigured } from "@/lib/photon";
import { falkorConfigured, insightForAnalysis, recordReport } from "@/lib/graph";
import type { ConversationPhase, SceneAnalysis } from "@/lib/types";

export const maxDuration = 30;

interface SignalRequest {
  text?: string;
  encounterId?: string;
  imageBase64?: string;
  mimeType?: string;
  phase?: ConversationPhase;
  analysis?: SceneAnalysis;
  neighborhood?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignalRequest;
    const text = typeof body.text === "string" ? body.text : "";

    if (!text && !body.imageBase64 && !body.encounterId) {
      return Response.json(
        { error: "Send a photo, a message, or a demo encounter." },
        { status: 400 },
      );
    }

    const reply = await handleInboundPhoton({
      text,
      encounterId: body.encounterId,
      imageBase64: body.imageBase64,
      mimeType: body.mimeType,
      phase: body.phase,
      analysis: body.analysis,
      neighborhood: body.neighborhood,
    });

    const graph = reply.report
      ? await recordReport(reply.report)
      : insightForAnalysis(reply.analysis);

    return Response.json({
      ...reply,
      graph,
      runtime: {
        gemini: geminiConfigured(),
        photon: photonConfigured(),
        falkor: falkorConfigured(),
        model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signal failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    service: "WildSignal",
    gemini: geminiConfigured(),
    photon: photonConfigured(),
  });
}
