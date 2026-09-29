export function cn(...classes: Array<string | false | null | undefined>) { return classes.filter(Boolean).join(" "); }
export function formatDate(value: string | Date | null) {
  if (!value) return "Draft";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}
export function initials(name: string) { return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase(); }
