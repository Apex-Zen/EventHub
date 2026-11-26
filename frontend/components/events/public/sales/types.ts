export interface SalesKpiItem {
  id: string;
  label: string;
  value: string;
  subtext: string;
}

export interface TierSalesRow {
  id: string;
  tier: string;
  price: number;
  sold: number;
  left: number;
  revenue: number;
  progress: number;
}

export interface DailyTicketSale {
  dateLabel: string;
  count: number;
  isLatest?: boolean;
}

export interface PurchaseRow {
  id: string;
  time: string;
  buyer: string;
  tier: string;
  qty: number;
  passCode: string;
}
