export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((voice) => /en-US/i.test(voice.lang) && /natural|premium|enhanced/i.test(voice.name)) ??
    voices.find((voice) => /en-US/i.test(voice.lang) && /google|samantha|aria|jenny/i.test(voice.name)) ??
    voices.find((voice) => /^en/i.test(voice.lang)) ??
    voices[0]
  );
}

function loadVoices() {
  const existing = window.speechSynthesis.getVoices();
  if (existing.length) return Promise.resolve(existing);
  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const finish = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener("voiceschanged", finish, { once: true });
    window.setTimeout(finish, 400);
  });
}

export function speak(text: string, onEnd?: () => void) {
  if (!canSpeak() || !text.trim()) {
    onEnd?.();
    return;
  }
  void loadVoices().then((voices) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, " ").trim());
    utterance.rate = 0.96;
    utterance.pitch = 0.95;
    utterance.lang = "en-US";
    const voice = pickVoice(voices);
    if (voice) utterance.voice = voice;
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
