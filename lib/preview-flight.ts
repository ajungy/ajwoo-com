// A single playing element bridges two React trees. Only the clip the visitor
// opens leaves its slot. The browser keeps its decoder, buffered data and clock.
type Flight = {
  base: string;
  path: string;
  video: HTMLVideoElement;
  layer: HTMLDivElement;
  source: HTMLElement;
  destination?: HTMLElement;
  animation?: Animation;
  timer: number;
};

let flight: Flight | undefined;

function move(video: HTMLVideoElement, parent: HTMLElement) {
  const target = parent as HTMLElement & { moveBefore?: (node: Node, before: Node | null) => void };
  if (target.moveBefore && video.isConnected && parent.isConnected) target.moveBefore(video, null);
  else parent.appendChild(video);
  if (video.paused) void video.play().catch(() => {});
}

function finish(current: Flight) {
  if (current !== flight) return;
  flight = undefined;
  clearTimeout(current.timer);
  current.animation?.cancel();
  const slot = current.destination?.isConnected ? current.destination : current.source;
  if (slot.isConnected) move(current.video, slot);
  else current.video.pause();
  current.source.removeAttribute('data-in-flight');
  current.destination?.removeAttribute('data-in-flight');
  current.layer.remove();
}

function lift(slot: HTMLElement, path: string) {
  if (flight) finish(flight);
  const video = slot.querySelector('video');
  if (!video || !slot.dataset.preview) return false;
  const rect = slot.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;

  const layer = document.createElement('div');
  layer.className = 'preview-flight';
  Object.assign(layer.style, { left: rect.left + 'px', top: rect.top + 'px', width: rect.width + 'px', height: rect.height + 'px' });
  document.body.appendChild(layer);
  slot.setAttribute('data-in-flight', '');
  move(video, layer);
  const current: Flight = { base: slot.dataset.preview, path, video, layer, source: slot, timer: 0 };
  flight = current;
  current.timer = window.setTimeout(() => finish(current), 8000);
  return true;
}

export function openPreview(slot: HTMLElement, path: string) {
  if (!lift(slot, path)) return false;
  history.replaceState({ ...history.state, previewReturn: { path, base: slot.dataset.preview, y: scrollY } }, '');
  return true;
}

export function isPlainClick(event: { button: number; defaultPrevented: boolean; metaKey: boolean; ctrlKey: boolean; altKey: boolean; shiftKey: boolean }) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
}

export function arrivingVideo(base: string, path = location.pathname) {
  return flight?.base === base && flight.path === path ? flight.video : undefined;
}

export function dockPreview(slot: HTMLElement) {
  const current = flight;
  if (!current || !arrivingVideo(current.base) || current.base !== slot.dataset.preview) return;
  current.destination = slot;
  slot.setAttribute('data-in-flight', '');
  const isReturn = !slot.hasAttribute('data-preview-detail');
  const section = slot.closest('section');
  if (isReturn) section?.setAttribute('data-preview-return', '');

  // Next restores scroll and the gallery measures its responsive geometry at
  // commit. Measure the endpoint after those updates, outside the animation.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (flight !== current || !slot.isConnected) return;
    if (isReturn && Number.isFinite(history.state?.previewReturn?.y)) {
      window.scrollTo({ top: history.state.previewReturn.y, behavior: 'instant' });
    }
    const to = slot.getBoundingClientRect();
    const from = current.layer.getBoundingClientRect();
    if (!to.width || !to.height || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish(current);
      return;
    }
    current.animation = current.layer.animate([
      { transform: 'none' },
      { transform: 'translate(' + (to.left - from.left) + 'px,' + (to.top - from.top) + 'px) scale(' + to.width / from.width + ',' + to.height / from.height + ')' },
    ], { duration: 500, easing: 'ease-in-out', fill: 'forwards' });
    current.animation.onfinish = () => finish(current);
  }));
}

// The browser changes history before Next replaces the outgoing DOM. Lift the
// active player here as well for Back and Forward, including swipe navigation.
export function onPreviewHistory() {
  if (flight) finish(flight);
  const slots = Array.from(document.querySelectorAll<HTMLElement>('[data-preview]'));
  const back = history.state?.previewReturn;
  const hero = slots.find(slot => slot.dataset.previewDetail === back?.path && slot.hasAttribute('data-preview-detail') && slot.dataset.preview === back?.base);
  const slot = hero ?? slots.find(slot => slot.dataset.previewLink === location.pathname);
  if (slot) lift(slot, location.pathname);
}
