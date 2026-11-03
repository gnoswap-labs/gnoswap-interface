export type OrderListStatus = "active" | "past";

export interface GetOrdersRequest {
  address: string;
  status: OrderListStatus;
  page: number;
  size?: number;
}

export interface GetOrderHistoryRequest {
  orderId: string;
  page: number;
  size?: number;
}
