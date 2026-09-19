export type RoomMessage = {
  id: string;
  at: number;
  from: "resident" | "wildsignal" | "system";
  text: string;
  handle: string;
};

const MAX = 80;
const messages: RoomMessage[] = [];

export function maskHandle(raw?: string) {
  if (!raw) return "Messages";
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 4) return `…${digits.slice(-4)}`;
  if (raw.includes("@")) return raw.split("@")[0] + "@…";
  return "Messages";
}

export function pushRoom(input: {
  from: RoomMessage["from"];
  text: string;
  handle?: string;
}) {
  const text = input.text.trim();
  if (!text) return null;
  const item: RoomMessage = {
    id: `rm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    at: Date.now(),
    from: input.from,
    text,
    handle: maskHandle(input.handle),
  };
  messages.push(item);
  if (messages.length > MAX) messages.splice(0, messages.length - MAX);
  return item;
}

export function listRoom() {
  return [...messages];
}
