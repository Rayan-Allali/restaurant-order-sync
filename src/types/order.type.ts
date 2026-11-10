export const ORDER_STATUSES = [
  "new",
  "preparing",
  "ready",
  "served",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export interface OrderI {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: number;
  updatedAt: number;
}

export interface OrderItem {
  name: string;
  qte: number;
}