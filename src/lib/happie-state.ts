// Shared state for opening Happie from anywhere (e.g., search bar)
// Uses a simple event emitter pattern — no external deps

type Listener = (message: string) => void;

const listeners: Set<Listener> = new Set();

export function onHappieOpen(fn: Listener) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function openHappie(message: string) {
  listeners.forEach((fn) => fn(message));
}
