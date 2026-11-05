export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export interface PriceChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: "kg" | "liter" | "dozen" | "piece";
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: PriceChange;
  markets: MarketPrice[];
}