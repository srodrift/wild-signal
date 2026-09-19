export const DEFAULT_TEXT_NUMBER = "+16287895362";
export const DEFAULT_TEXT_USER_ID = "dd375aca-c257-492a-aac3-85673371d70c";
const SPECTRUM_API = "https://spectrum.photon.codes";

export function publicTextNumber() {
  return process.env.WILDSIGNAL_TEXT_NUMBER?.trim() || DEFAULT_TEXT_NUMBER;
}

export function publicTextUserId() {
  return process.env.WILDSIGNAL_PHOTON_USER_ID?.trim() || DEFAULT_TEXT_USER_ID;
}

export function formatUsNumber(e164: string) {
  const digits = e164.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return e164;
}

export function toE164(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (input.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  return null;
}

export function smsHref(e164: string, body: string) {
  return `sms:${e164}&body=${encodeURIComponent(body)}`;
}

export function defaultDraft() {
  return "hi";
}

export function findUserByPhone(users: SpectrumUser[], phone: string) {
  const want = toE164(phone);
  if (!want) return null;
  return (
    users.find((user) => toE164(user.phoneNumber) === want) ??
    users.find((user) => toE164(user.assignedPhoneNumber) === want) ??
    null
  );
}

export function photonRedirectUrl(userId: string, body = defaultDraft()) {
  const url = new URL(`${SPECTRUM_API}/users/${userId}/redirect`);
  url.searchParams.set("msg", body);
  return url.toString();
}

function authHeader() {
  const id = process.env.SPECTRUM_PROJECT_ID;
  const secret = process.env.SPECTRUM_PROJECT_SECRET;
  if (!id || !secret) return null;
  return `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
}

export interface SpectrumUser {
  id: string;
  phoneNumber: string;
  assignedPhoneNumber: string;
  firstName?: string | null;
  type?: string;
}

export async function listSpectrumUsers(): Promise<SpectrumUser[]> {
  const id = process.env.SPECTRUM_PROJECT_ID;
  const auth = authHeader();
  if (!id || !auth) return [];
  const response = await fetch(`${SPECTRUM_API}/projects/${id}/users/`, {
    headers: { Authorization: auth, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) return [];
  const json = (await response.json()) as { data?: { users?: SpectrumUser[] } };
  return json.data?.users ?? [];
}

export async function createSharedUser(
  phoneNumber: string,
  firstName?: string,
  email?: string,
) {
  const id = process.env.SPECTRUM_PROJECT_ID;
  const auth = authHeader();
  if (!id || !auth) {
    throw new Error("Photon credentials are not configured.");
  }
  const response = await fetch(`${SPECTRUM_API}/projects/${id}/users/`, {
    method: "POST",
    headers: {
      Authorization: auth,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "shared",
      phoneNumber,
      firstName: firstName || "Resident",
      lastName: "WildSignal",
      ...(email ? { email } : {}),
    }),
  });
  const json = (await response.json()) as {
    succeed?: boolean;
    data?: SpectrumUser;
    message?: string;
  };
  if (!response.ok || !json.succeed || !json.data) {
    const existing = findUserByPhone(await listSpectrumUsers(), phoneNumber);
    if (existing) return existing;
    throw new Error(json.message || "Photon could not add that number.");
  }
  return json.data;
}

export function linePayload(user?: SpectrumUser | null) {
  const e164 = user?.assignedPhoneNumber || publicTextNumber();
  const userId = user?.id || publicTextUserId();
  const draft = defaultDraft();
  return {
    e164,
    display: formatUsNumber(e164),
    smsHref: smsHref(e164, draft),
    redirectUrl: photonRedirectUrl(userId, draft),
    userId,
  };
}
