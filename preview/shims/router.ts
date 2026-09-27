// In-memory router for the single-file preview build.
type L = () => void;
let path = "/";
const listeners = new Set<L>();
export const getPath = () => path;
export const subscribe = (l: L) => { listeners.add(l); return () => listeners.delete(l); };
export function navigate(href: string) {
  const [p, hash] = href.split("#");
  const target = p || path;
  const changed = target !== path;
  path = target.split("?")[0] || "/";
  if (changed) { listeners.forEach((l) => l()); }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const el = hash ? document.getElementById(hash) : null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else if (changed) window.scrollTo(0, 0);
  }));
}
