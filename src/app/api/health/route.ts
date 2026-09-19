import { geminiConfigured } from "@/lib/gemini";
import { falkorConfigured, graphOverview } from "@/lib/graph";
import { photonConfigured } from "@/lib/photon";
import { formatUsNumber, publicTextNumber } from "@/lib/spectrum-line";
import { photonListenError, photonListening, startPhotonListener } from "@/lib/spectrum-listener";

export async function GET() {
  void startPhotonListener();
  return Response.json({
    ok: true,
    service: "wildsignal",
    gemini: geminiConfigured(),
    photon: photonConfigured(),
    photonListening: photonListening(),
    photonListenError: photonListenError(),
    textNumber: formatUsNumber(publicTextNumber()),
    falkor: falkorConfigured(),
    graph: graphOverview(),
  });
}
