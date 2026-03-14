export const SUPPORT_LINKS = {
  tier3: process.env.NEXT_PUBLIC_STRIPE_SUPPORT_3 ?? "",
  tier10: process.env.NEXT_PUBLIC_STRIPE_SUPPORT_10 ?? "",
  tier25: process.env.NEXT_PUBLIC_STRIPE_SUPPORT_25 ?? "",
  feedback: process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "",
} as const;

export const SUPPORT_TIERS = [
  { label: "Coffee — $3", hrefKey: "tier3" as const },
  { label: "Support — $10", hrefKey: "tier10" as const },
  { label: "Sponsor — $25", hrefKey: "tier25" as const },
];
