import { TransactionMessage, WalletResponse } from "@common/clients/wallet-client/protocols";

import {
  CancelOrderRequest,
  CreateDcaOrderRequest,
  CreateLimitOrderRequest,
  GetDcaPairRequest,
  GetDcaScheduleRequest,
  GetOrderHistoryRequest,
  GetOrdersRequest,
} from "./request";
import {
  DcaConfigResponse,
  DcaExecutionItem,
  DcaOrderItem,
  DcaPairResponse,
  DcaScheduleResponse,
  LimitConfigResponse,
  LimitFillItem,
  LimitOrderItem,
  OrderPagedResponse,
} from "./response";

export interface OrderRepository {
  getDcaConfig(): Promise<DcaConfigResponse>;

  /** Minimum amount and price-limit support of one swap direction. */
  getDcaPair(request: GetDcaPairRequest): Promise<DcaPairResponse>;

  getDcaSchedule(request: GetDcaScheduleRequest): Promise<DcaScheduleResponse>;

  getDcaOrders(request: GetOrdersRequest): Promise<OrderPagedResponse<DcaOrderItem>>;

  /** `packagePath` selects the order's realm; the order-api defaults to the current one. */
  getDcaOrder(orderId: string, packagePath?: string): Promise<DcaOrderItem>;

  getDcaExecutions(request: GetOrderHistoryRequest): Promise<OrderPagedResponse<DcaExecutionItem>>;

  getLimitConfig(): Promise<LimitConfigResponse>;

  getLimitOrders(request: GetOrdersRequest): Promise<OrderPagedResponse<LimitOrderItem>>;

  getLimitOrder(orderId: string, packagePath?: string): Promise<LimitOrderItem>;

  getLimitOrderFills(request: GetOrderHistoryRequest): Promise<OrderPagedResponse<LimitFillItem>>;

  makeCreateDcaOrderMessages(request: CreateDcaOrderRequest): Promise<TransactionMessage[]>;

  makeCreateLimitOrderMessages(request: CreateLimitOrderRequest): Promise<TransactionMessage[]>;

  sendCreateDcaOrder(request: CreateDcaOrderRequest): Promise<WalletResponse<{ hash: string }>>;

  sendCancelDcaOrder(request: CancelOrderRequest): Promise<WalletResponse<{ hash: string }>>;

  sendClaimDcaOrder(request: CancelOrderRequest): Promise<WalletResponse<{ hash: string }>>;

  sendCreateLimitOrder(request: CreateLimitOrderRequest): Promise<WalletResponse<{ hash: string }>>;

  sendCancelLimitOrder(request: CancelOrderRequest): Promise<WalletResponse<{ hash: string }>>;
}
