export type OrderListStatus = "active" | "past";

export interface GetOrdersRequest {
  address: string;
  status: OrderListStatus;
  page: number;
  size?: number;
}

export interface GetOrderHistoryRequest {
  orderId: string;
  /** Realm of the order; the order-api defaults to the current realm. */
  packagePath?: string;
  page: number;
  size?: number;
}
