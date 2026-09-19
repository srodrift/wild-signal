import { listRoom } from "@/lib/live-room";
import { photonListenError, photonListening, startPhotonListener } from "@/lib/spectrum-listener";

export async function GET() {
  void startPhotonListener();
  return Response.json({
    ok: true,
    listening: photonListening(),
    listenError: photonListenError(),
    messages: listRoom(),
  });
}
