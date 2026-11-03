import { CommonError } from "@common/errors";

import { devDcaFixtures, devDcaSchedule, devLimitFixtures, DEV_DCA_CONFIG, DEV_LIMIT_CONFIG } from "./mock/dev-gnoswap-order-mock";
import { OrderRepositoryImpl } from "./order-repository-impl";
import { GetDcaScheduleRequest, GetOrderHistoryRequest, GetOrdersRequest } from "./request";
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

const DEFAULT_PAGE_SIZE = 10;
const LOADING_DURATION = 300;

const DCA_ACTIVE_STATUSES: DcaOrderItem["status"][] = ["ACTIVE"];
const LIMIT_ACTIVE_STATUSES: LimitOrderItem["status"][] = ["OPEN", "PARTIALLY_FILLED"];

/**
 * Temporary order repository for dev.gnoswap while order-api is not deployed.
 * Reads return dev.gnoswap based fixtures; order transactions still go to the
 * order realms through OrderRepositoryImpl. Remove this file and its provider
 * wiring (revert the commit that added it) once order-api is live.
 */
export class OrderRepositoryDevMock extends OrderRepositoryImpl {
  private owner = "";

  private delay<T>(value: T): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(value), LOADING_DURATION));
  }

  private paginate<T>(items: T[], page: number, size = DEFAULT_PAGE_SIZE): OrderPagedResponse<T> {
    const start = (page - 1) * size;
    return {
      items: items.slice(start, start + size),
      pageInfo: { currentPage: page, totalItems: items.length, totalPages: Math.ceil(items.length / size) },
    };
  }

  public getDcaConfig = async (): Promise<DcaConfigResponse> => this.delay(DEV_DCA_CONFIG);

  public getDcaSchedule = async (request: GetDcaScheduleRequest): Promise<DcaScheduleResponse> =>
    this.delay(devDcaSchedule(request.interval, request.executionCount));

  public getDcaOrders = async (request: GetOrdersRequest): Promise<OrderPagedResponse<DcaOrderItem>> => {
    this.owner = request.address;
    const orders = devDcaFixtures(request.address)
      .map(fixture => fixture.order)
      .filter(order => DCA_ACTIVE_STATUSES.includes(order.status) === (request.status === "active"));
    return this.delay(this.paginate(orders, request.page, request.size));
  };

  public getDcaOrder = async (orderId: string): Promise<DcaOrderItem> => {
    const fixture = devDcaFixtures(this.owner).find(item => item.order.orderId === orderId);
    if (!fixture) throw new CommonError("NOT_FOUND_DATA");
    return this.delay(fixture.order);
  };

  public getDcaExecutions = async (request: GetOrderHistoryRequest): Promise<OrderPagedResponse<DcaExecutionItem>> => {
    const fixture = devDcaFixtures(this.owner).find(item => item.order.orderId === request.orderId);
    return this.delay(this.paginate(fixture?.executions ?? [], request.page, request.size));
  };

  public getLimitConfig = async (): Promise<LimitConfigResponse> => this.delay(DEV_LIMIT_CONFIG);

  public getLimitOrders = async (request: GetOrdersRequest): Promise<OrderPagedResponse<LimitOrderItem>> => {
    this.owner = request.address;
    const orders = devLimitFixtures(request.address)
      .map(fixture => fixture.order)
      .filter(order => LIMIT_ACTIVE_STATUSES.includes(order.status) === (request.status === "active"));
    return this.delay(this.paginate(orders, request.page, request.size));
  };

  public getLimitOrder = async (orderId: string): Promise<LimitOrderItem> => {
    const fixture = devLimitFixtures(this.owner).find(item => item.order.orderId === orderId);
    if (!fixture) throw new CommonError("NOT_FOUND_DATA");
    return this.delay(fixture.order);
  };

  public getLimitOrderFills = async (request: GetOrderHistoryRequest): Promise<OrderPagedResponse<LimitFillItem>> => {
    const fixture = devLimitFixtures(this.owner).find(item => item.order.orderId === request.orderId);
    return this.delay(this.paginate(fixture?.fills ?? [], request.page, request.size));
  };
}
