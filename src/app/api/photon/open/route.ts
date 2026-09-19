import { defaultDraft, photonRedirectUrl, publicTextUserId } from "@/lib/spectrum-line";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const msg = url.searchParams.get("msg") ?? defaultDraft();
  return Response.redirect(photonRedirectUrl(publicTextUserId(), msg), 302);
}
