import { TransactionMessage, WalletResponse } from "@common/clients/wallet-client/protocols";

import MockDcaConfigResponse from "./mock/dca-config.json";
import MockDcaExecutionsResponse from "./mock/dca-executions.json";
import MockDcaOrdersActiveResponse from "./mock/dca-orders-active.json";
import MockDcaOrdersPastResponse from "./mock/dca-orders-past.json";
import MockDcaScheduleResponse from "./mock/dca-schedule.json";
import MockLimitConfigResponse from "./mock/limit-config.json";
import MockLimitFillsResponse from "./mock/limit-fills.json";
import MockLimitMarketPricesResponse from "./mock/limit-market-prices.json";
import MockLimitOrdersActiveResponse from "./mock/limit-orders-active.json";
import MockLimitOrdersPastResponse from "./mock/limit-orders-past.json";
import { getLimitMarketPricePairKey } from "@utils/limit-market-price-utils";

import { OrderRepository } from "./order-repository";
import {
  GetDcaPairRequest,
  GetDcaScheduleRequest,
  GetLimitMarketPricesRequest,
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
  LimitMarketPricesResponse,
  LimitOrderItem,
  OrderPagedResponse,
} from "./response";

const MOCK_TX_RESPONSE: WalletResponse<{ hash: string }> = {
  code: 0,
  status: "success",
  type: "TRANSACTION_SUCCESS",
  message: "",
  data: { hash: "mockOrderTransactionHash" },
};

/** Serves the order-api fixtures in `./mock` so the order UI works without a backend. */
export class OrderRepositoryMock implements OrderRepository {
  private static LOADING_DURATION = 500;

  private delay<T>(value: T): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(value), OrderRepositoryMock.LOADING_DURATION));
  }

  private paginate<T>(items: T[], page: number, size = 10): OrderPagedResponse<T> {
    const start = (page - 1) * size;
    return {
      items: items.slice(start, start + size),
      pageInfo: { currentPage: page, totalItems: items.length, totalPages: Math.ceil(items.length / size) },
    };
  }

  getDcaConfig(): Promise<DcaConfigResponse> {
    return this.delay(MockDcaConfigResponse.data);
  }

  /** Every direction of a whitelisted pair has a price limit in the fixtures. */
  getDcaPair(request: GetDcaPairRequest): Promise<DcaPairResponse> {
    const supported = MockDcaConfigResponse.data.whitelistedPools.some(poolPath => {
      const [token0, token1] = poolPath.split(":");
      return [token0, token1].includes(request.inputToken) && [token0, token1].includes(request.outputToken);
    });
    return this.delay({
      ...request,
      minAmountPerExecution: MockDcaConfigResponse.data.minAmountPerExecution,
      priceLimit: supported ? { minOutputPerInputX128: "1", updatedAt: 0 } : null,
      supported,
    });
  }

  getDcaSchedule(request: GetDcaScheduleRequest): Promise<DcaScheduleResponse> {
    const firstExecutionAt = MockDcaScheduleResponse.data.firstExecutionAt;
    return this.delay({
      ...MockDcaScheduleResponse.data,
      estimatedEndAt: firstExecutionAt + (request.executionCount - 1) * request.interval,
    });
  }

  getDcaOrders(request: GetOrdersRequest): Promise<OrderPagedResponse<DcaOrderItem>> {
    const response = request.status === "active" ? MockDcaOrdersActiveResponse : MockDcaOrdersPastResponse;
    return this.delay(this.paginate(response.data.items as DcaOrderItem[], request.page, request.size));
  }

  getDcaOrder(orderId: string): Promise<DcaOrderItem> {
    const items = [
      ...MockDcaOrdersActiveResponse.data.items,
      ...MockDcaOrdersPastResponse.data.items,
    ] as DcaOrderItem[];
    const order = items.find(item => item.orderId === orderId);
    return order ? this.delay(order) : Promise.reject(new Error("ORDER_NOT_FOUND"));
  }

  getDcaExecutions(request: GetOrderHistoryRequest): Promise<OrderPagedResponse<DcaExecutionItem>> {
    return this.delay(this.paginate(MockDcaExecutionsResponse.data.items, request.page, request.size));
  }

  getLimitConfig(): Promise<LimitConfigResponse> {
    return this.delay(MockLimitConfigResponse.data);
  }

  getLimitMarketPrices({ pairs }: GetLimitMarketPricesRequest): Promise<LimitMarketPricesResponse> {
    const fixtureByKey = new Map(
      MockLimitMarketPricesResponse.items.map(item => [getLimitMarketPricePairKey(item), item.price] as const),
    );

    return this.delay({
      items: pairs.map(pair => ({
        ...pair,
        price: fixtureByKey.get(getLimitMarketPricePairKey(pair)) ?? null,
      })),
    });
  }

  getLimitOrders(request: GetOrdersRequest): Promise<OrderPagedResponse<LimitOrderItem>> {
    const response = request.status === "active" ? MockLimitOrdersActiveResponse : MockLimitOrdersPastResponse;
    return this.delay(this.paginate(response.data.items as LimitOrderItem[], request.page, request.size));
  }

  getLimitOrder(orderId: string): Promise<LimitOrderItem> {
    const items = [
      ...MockLimitOrdersActiveResponse.data.items,
      ...MockLimitOrdersPastResponse.data.items,
    ] as LimitOrderItem[];
    const order = items.find(item => item.orderId === orderId);
    return order ? this.delay(order) : Promise.reject(new Error("ORDER_NOT_FOUND"));
  }

  getLimitOrderFills(request: GetOrderHistoryRequest): Promise<OrderPagedResponse<LimitFillItem>> {
    return this.delay(this.paginate(MockLimitFillsResponse.data.items, request.page, request.size));
  }

  async makeCreateDcaOrderMessages(): Promise<TransactionMessage[]> {
    return [];
  }

  async makeCreateLimitOrderMessages(): Promise<TransactionMessage[]> {
    return [];
  }

  sendCreateDcaOrder(): Promise<WalletResponse<{ hash: string }>> {
    return this.delay(MOCK_TX_RESPONSE);
  }

  sendCancelDcaOrder(): Promise<WalletResponse<{ hash: string }>> {
    return this.delay(MOCK_TX_RESPONSE);
  }

  sendClaimDcaOrder(): Promise<WalletResponse<{ hash: string }>> {
    return this.delay(MOCK_TX_RESPONSE);
  }

  sendCreateLimitOrder(): Promise<WalletResponse<{ hash: string }>> {
    return this.delay(MOCK_TX_RESPONSE);
  }

  sendCancelLimitOrder(): Promise<WalletResponse<{ hash: string }>> {
    return this.delay(MOCK_TX_RESPONSE);
  }
}
