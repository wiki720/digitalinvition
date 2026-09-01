export type Plan = "classic" | "royal";

export type WeddingTemplate = {
  id: string;
  name: string;
  tagline: string;
  badge?: "New" | "Most Liked" | "Limited Edition";
  plan: Plan;
  palette: {
    bg: string;       // hsl
    fg: string;
    accent: string;
    accentSoft: string;
  };
  pattern: "mughal" | "floral" | "celestial" | "geometric" | "rose" | "palace" | "garden" | "minimal";
};

export const TEMPLATES: WeddingTemplate[] = [
  {
    id: "emerald-noir",
    name: "Emerald Noir",
    tagline: "Deep emerald and gold with ornate corner accents",
    badge: "Limited Edition",
    plan: "classic",
    palette: { bg: "150 35% 8%", fg: "42 60% 90%", accent: "42 70% 60%", accentSoft: "42 55% 75%" },
    pattern: "mughal",
  },
  {
    id: "crimson-royale",
    name: "Crimson Royale",
    tagline: "Charcoal base with gold and deep red luxury reveal",
    badge: "Most Liked",
    plan: "royal",
    palette: { bg: "0 20% 8%", fg: "42 55% 88%", accent: "0 65% 45%", accentSoft: "42 65% 70%" },
    pattern: "palace",
  },
  {
    id: "royal-elegance",
    name: "Royal Elegance",
    tagline: "Classic ivory and gold with palace motifs",
    badge: "New",
    plan: "classic",
    palette: { bg: "40 30% 92%", fg: "30 30% 18%", accent: "38 60% 45%", accentSoft: "38 65% 70%" },
    pattern: "palace",
  },
  {
    id: "garden-romance",
    name: "Garden Romance",
    tagline: "Soft rose and blush with floral accents",
    badge: "New",
    plan: "classic",
    palette: { bg: "350 30% 94%", fg: "340 25% 22%", accent: "340 55% 55%", accentSoft: "340 70% 80%" },
    pattern: "garden",
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    tagline: "Deep navy and gold with geometric patterns",
    plan: "classic",
    palette: { bg: "220 35% 10%", fg: "42 60% 90%", accent: "42 70% 60%", accentSoft: "42 55% 75%" },
    pattern: "minimal",
  },
  {
    id: "mughal-emerald",
    name: "Mughal Emerald",
    tagline: "Emerald green with Mughal-inspired floral doors",
    plan: "royal",
    palette: { bg: "158 50% 12%", fg: "42 65% 92%", accent: "42 75% 55%", accentSoft: "42 60% 75%" },
    pattern: "mughal",
  },
  {
    id: "rose-gold-blush",
    name: "Rose Gold Blush",
    tagline: "Blush pink and rose gold with ornate florals",
    plan: "royal",
    palette: { bg: "20 40% 92%", fg: "20 30% 22%", accent: "15 60% 55%", accentSoft: "15 65% 75%" },
    pattern: "rose",
  },
  {
    id: "midnight-royal",
    name: "Midnight Royal",
    tagline: "Deep purple and silver with celestial stars",
    plan: "royal",
    palette: { bg: "270 40% 12%", fg: "42 50% 88%", accent: "260 40% 70%", accentSoft: "260 50% 80%" },
    pattern: "celestial",
  },
];

export const getTemplate = (id: string) =>
  TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];

export const canUseTemplate = (templateId: string, userPlan: Plan | null | undefined) => {
  const tpl = getTemplate(templateId);
  if (tpl.plan === "classic") return true;
  return userPlan === "royal";
};
