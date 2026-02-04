export const PERIODS = ['today', 'weekly', 'monthly', 'yearly'] as const;
export type Period = (typeof PERIODS)[number];
export const SUB_CATEGORIES = ['In Stock', 'Out of Stock'] as const;
export type SubCategory = (typeof SUB_CATEGORIES)[number];
