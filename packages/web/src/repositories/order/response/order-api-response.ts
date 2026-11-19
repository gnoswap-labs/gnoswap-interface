/** Envelope used by every order-api endpoint. */
export interface OrderAPIResponse<T> {
  message: string;
  data: T;
}

export interface OrderPageInfo {
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface OrderPagedResponse<T> {
  items: T[];
  pageInfo: OrderPageInfo;
}

export interface OrderHaltedStatus {
  execute: boolean;
  withdraw: boolean;
}
