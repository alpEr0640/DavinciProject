export function initials(text?: string) {
  if (!text) return "?";
  return text
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
