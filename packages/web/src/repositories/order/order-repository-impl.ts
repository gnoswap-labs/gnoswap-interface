import { getGRC20Allowance } from "@common/clients/gno-provider";
import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { TransactionMessage, WalletResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { DEFAULT_GAS_FEE, DEFAULT_GAS_WANTED } from "@common/values";
import { GnoProvider } from "@gnolang/gno-js-client";
import { makeQueryParameter } from "@utils/network.utils";
import { generateSendTransactionParams, withTransactionGuard } from "@utils/transaction-utils";

import { OrderRepository } from "./order-repository";
import {
  makeCancelDcaOrderMessages,
  makeCancelLimitOrderMessages,
  makeClaimDcaOrderMessages,
  makeCreateDcaOrderMessagesWithApproves,
  makeCreateLimitOrderMessagesWithApproves,
} from "./order.message";
import {
  CancelOrderRequest,
  CreateDcaOrderRequest,
  CreateLimitOrderRequest,
  GetDcaPairRequest,
  GetDcaScheduleRequest,
  GetOrderHistoryRequest,
  GetOrdersRequest,
  OrderGasRequest,
  GetLimitMarketPricesRequest,
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
  LimitMarketPricesResponse,
  OrderAPIResponse,
  OrderPagedResponse,
} from "./response";

export const DEFAULT_ORDER_PAGE_SIZE = 10;

export class OrderRepositoryImpl implements OrderRepository {
  private networkClient: NetworkClient | null;
  private walletClient: WalletClient | null;
  private rpcProvider: GnoProvider | null;

  constructor(networkClient: NetworkClient | null, walletClient: WalletClient | null, rpcProvider: GnoProvider | null) {
    this.networkClient = networkClient;
    this.walletClient = walletClient;
    this.rpcProvider = rpcProvider;
  }

  public getDcaConfig = async (): Promise<DcaConfigResponse> => {
    return this.get<DcaConfigResponse>("orders/dca/config");
  };

  public getDcaPair = async ({ inputToken, outputToken }: GetDcaPairRequest): Promise<DcaPairResponse> => {
    return this.get<DcaPairResponse>(
      `orders/dca/pair${makeQueryParameter({
        inputToken: encodeURIComponent(inputToken),
        outputToken: encodeURIComponent(outputToken),
      })}`,
    );
  };

  public getDcaSchedule = async (request: GetDcaScheduleRequest): Promise<DcaScheduleResponse> => {
    return this.get<DcaScheduleResponse>(`orders/dca/schedule${makeQueryParameter({ ...request })}`);
  };

  public getDcaOrders = async (request: GetOrdersRequest): Promise<OrderPagedResponse<DcaOrderItem>> => {
    const { address, ...params } = request;
    return this.get<OrderPagedResponse<DcaOrderItem>>(
      `users/${encodeURIComponent(address)}/orders/dca${this.makePageQuery(params)}`,
    );
  };

  public getDcaOrder = async (orderId: string, packagePath?: string): Promise<DcaOrderItem> => {
    return this.get<DcaOrderItem>(`orders/dca/${encodeURIComponent(orderId)}${this.makeRealmQuery(packagePath)}`);
  };

  public getDcaExecutions = async (request: GetOrderHistoryRequest): Promise<OrderPagedResponse<DcaExecutionItem>> => {
    const { orderId, packagePath, ...params } = request;
    return this.get<OrderPagedResponse<DcaExecutionItem>>(
      `orders/dca/${encodeURIComponent(orderId)}/executions${this.makePageQuery(params, packagePath)}`,
    );
  };

  public getLimitConfig = async (): Promise<LimitConfigResponse> => {
    return this.get<LimitConfigResponse>("orders/limit/config");
  };

  public getLimitMarketPrices = async (request: GetLimitMarketPricesRequest): Promise<LimitMarketPricesResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient.post<
      GetLimitMarketPricesRequest,
      OrderAPIResponse<LimitMarketPricesResponse>
    >({
      url: "orders/limit/market-prices",
      body: request,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.message);
    }

    return response.data.data;
  };

  public getLimitOrders = async (request: GetOrdersRequest): Promise<OrderPagedResponse<LimitOrderItem>> => {
    const { address, ...params } = request;
    return this.get<OrderPagedResponse<LimitOrderItem>>(
      `users/${encodeURIComponent(address)}/orders/limit${this.makePageQuery(params)}`,
    );
  };

  public getLimitOrder = async (orderId: string, packagePath?: string): Promise<LimitOrderItem> => {
    return this.get<LimitOrderItem>(`orders/limit/${encodeURIComponent(orderId)}${this.makeRealmQuery(packagePath)}`);
  };

  public getLimitOrderFills = async (request: GetOrderHistoryRequest): Promise<OrderPagedResponse<LimitFillItem>> => {
    const { orderId, packagePath, ...params } = request;
    return this.get<OrderPagedResponse<LimitFillItem>>(
      `orders/limit/${encodeURIComponent(orderId)}/fills${this.makePageQuery(params, packagePath)}`,
    );
  };

  public makeCreateDcaOrderMessages = async (request: CreateDcaOrderRequest): Promise<TransactionMessage[]> => {
    const caller = await this.getAddress();
    return makeCreateDcaOrderMessagesWithApproves({ ...request, caller }, this.fetchAllowance);
  };

  public makeCreateLimitOrderMessages = async (request: CreateLimitOrderRequest): Promise<TransactionMessage[]> => {
    const caller = await this.getAddress();
    return makeCreateLimitOrderMessagesWithApproves({ ...request, caller }, this.fetchAllowance);
  };

  public sendCreateDcaOrder = async (request: CreateDcaOrderRequest): Promise<WalletResponse<{ hash: string }>> => {
    const messages = await this.makeCreateDcaOrderMessages(request);
    return this.sendTransaction(messages, request);
  };

  public sendCancelDcaOrder = async (request: CancelOrderRequest): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    return this.sendTransaction(
      makeCancelDcaOrderMessages({ orderId: request.orderId, caller, packagePath: request.packagePath }),
      request,
    );
  };

  public sendClaimDcaOrder = async (request: CancelOrderRequest): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    return this.sendTransaction(
      makeClaimDcaOrderMessages({ orderId: request.orderId, caller, packagePath: request.packagePath }),
      request,
    );
  };

  public sendCreateLimitOrder = async (request: CreateLimitOrderRequest): Promise<WalletResponse<{ hash: string }>> => {
    const messages = await this.makeCreateLimitOrderMessages(request);
    return this.sendTransaction(messages, request);
  };

  public sendCancelLimitOrder = async (request: CancelOrderRequest): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    return this.sendTransaction(
      makeCancelLimitOrderMessages({ orderId: request.orderId, caller, packagePath: request.packagePath }),
      request,
    );
  };

  private async get<T>(url: string): Promise<T> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient.get<OrderAPIResponse<T>>({ url });
    return response.data.data;
  }

  private makePageQuery(
    { status, page, size }: { status?: string; page: number; size?: number },
    packagePath?: string,
  ) {
    return makeQueryParameter({
      status,
      page,
      size: size ?? DEFAULT_ORDER_PAGE_SIZE,
      packagePath: packagePath ? encodeURIComponent(packagePath) : undefined,
    });
  }

  private makeRealmQuery(packagePath?: string) {
    return makeQueryParameter({ packagePath: packagePath ? encodeURIComponent(packagePath) : undefined });
  }

  private fetchAllowance = (packagePath: string, owner: string, spender: string): Promise<number> => {
    if (!this.rpcProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }
    return getGRC20Allowance(this.rpcProvider, packagePath, owner, spender);
  };

  private sendTransaction(
    messages: TransactionMessage[],
    { gasFee, gasUsed }: OrderGasRequest,
  ): Promise<WalletResponse<{ hash: string }>> {
    const gasWanted = gasUsed && Number(gasUsed) > 0 ? Number(gasUsed) : DEFAULT_GAS_WANTED;
    const sendTransactionParams = generateSendTransactionParams({
      messages,
      gasWanted,
      gasFee: Number(gasFee) || DEFAULT_GAS_FEE,
      memo: "",
    });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }

  private async getAddress(): Promise<string> {
    if (!this.walletClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const address = await this.walletClient.getAddress();
    if (!address) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    return address;
  }
}
