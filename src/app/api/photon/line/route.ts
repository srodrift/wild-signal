import {
  createSharedUser,
  linePayload,
  listSpectrumUsers,
  toE164,
} from "@/lib/spectrum-line";
import { photonConfigured } from "@/lib/photon";
import {
  photonListenError,
  photonListening,
  startPhotonListener,
} from "@/lib/spectrum-listener";

export async function GET() {
  void startPhotonListener();
  const users = await listSpectrumUsers();
  const owner =
    users.find((user) => user.id === process.env.WILDSIGNAL_PHOTON_USER_ID) ??
    users[0];
  return Response.json({
    ok: true,
    photon: photonConfigured(),
    listening: photonListening(),
    listenError: photonListenError(),
    plan: "shared-pool",
    ...linePayload(owner),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    phone?: string;
    name?: string;
    email?: string;
  };
  const e164 = toE164(body.phone ?? "");
  if (!e164) {
    return Response.json(
      { error: "Use the US mobile number your iMessage is linked to." },
      { status: 400 },
    );
  }

  const email = body.email?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { error: "If you add an Apple ID, it has to look like an email." },
      { status: 400 },
    );
  }

  try {
    const user = await createSharedUser(e164, body.name, email);
    return Response.json({
      ok: true,
      listening: photonListening(),
      ...linePayload(user),
      yourPhone: user.phoneNumber,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not add you as a user" },
      { status: 502 },
    );
  }
}
