import { TransactionMessage, WalletResponse } from "@common/clients/wallet-client/protocols";

import {
  CancelOrderRequest,
  CreateDcaOrderRequest,
  CreateLimitOrderRequest,
  GetDcaScheduleRequest,
  GetOrderHistoryRequest,
  GetOrdersRequest,
} from "./request";
import {
  DcaConfigResponse,
  DcaExecutionItem,
  DcaOrderItem,
  DcaScheduleResponse,
  LimitConfigResponse,
  LimitFillItem,
  LimitOrderItem,
  OrderPagedResponse,
} from "./response";

export interface OrderRepository {
  getDcaConfig(): Promise<DcaConfigResponse>;

  getDcaSchedule(request: GetDcaScheduleRequest): Promise<DcaScheduleResponse>;

  getDcaOrders(request: GetOrdersRequest): Promise<OrderPagedResponse<DcaOrderItem>>;

  getDcaOrder(orderId: string): Promise<DcaOrderItem>;

  getDcaExecutions(request: GetOrderHistoryRequest): Promise<OrderPagedResponse<DcaExecutionItem>>;

  getLimitConfig(): Promise<LimitConfigResponse>;

  getLimitOrders(request: GetOrdersRequest): Promise<OrderPagedResponse<LimitOrderItem>>;

  getLimitOrder(orderId: string): Promise<LimitOrderItem>;

  getLimitOrderFills(request: GetOrderHistoryRequest): Promise<OrderPagedResponse<LimitFillItem>>;

  makeCreateDcaOrderMessages(request: CreateDcaOrderRequest): Promise<TransactionMessage[]>;

  makeCreateLimitOrderMessages(request: CreateLimitOrderRequest): Promise<TransactionMessage[]>;

  sendCreateDcaOrder(request: CreateDcaOrderRequest): Promise<WalletResponse<{ hash: string }>>;

  sendCancelDcaOrder(request: CancelOrderRequest): Promise<WalletResponse<{ hash: string }>>;

  sendClaimDcaOrder(request: CancelOrderRequest): Promise<WalletResponse<{ hash: string }>>;

  sendCreateLimitOrder(request: CreateLimitOrderRequest): Promise<WalletResponse<{ hash: string }>>;

  sendCancelLimitOrder(request: CancelOrderRequest): Promise<WalletResponse<{ hash: string }>>;
}
