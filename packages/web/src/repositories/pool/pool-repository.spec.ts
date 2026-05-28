import { NetworkClient } from "@common/clients/network-client";
import {
  HttpDeleteRequestParam,
  HttpGetRequestParam,
  HttpPostRequestParam,
  HttpPutRequestParam,
  HttpResponse,
} from "@common/clients/network-client/protocols";
import { PoolListResponse, PoolRepository, PoolRepositoryImpl, PoolRepositoryMock } from ".";

class MockNetworkClient implements NetworkClient {
  public getCalls: HttpGetRequestParam[] = [];

  public constructor(private readonly getResponse?: unknown) {}

  public async get<R>(params: HttpGetRequestParam): Promise<HttpResponse<R>> {
    this.getCalls.push(params);

    const defaultResponse: PoolListResponse = {
      meta: {
        height: 0,
        timestamp: "",
      },
      data: [],
    };

    return {
      status: 200,
      message: "Success",
      data: (this.getResponse ?? defaultResponse) as R,
    };
  }

  public async post<T, R>(params: HttpPostRequestParam<T>): Promise<HttpResponse<R>> {
    void params;

    return {
      status: 200,
      message: "Success",
      data: {} as R,
    };
  }

  public async put<T, R>(params: HttpPutRequestParam<T>): Promise<HttpResponse<R>> {
    void params;

    return {
      status: 200,
      message: "Success",
      data: {} as R,
    };
  }

  public async delete<T, R>(params: HttpDeleteRequestParam<T>): Promise<HttpResponse<R>> {
    void params;

    return {
      status: 200,
      message: "Success",
      data: {} as R,
    };
  }
}

let poolRepository: PoolRepository;

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

beforeEach(() => {
  poolRepository = new PoolRepositoryMock();
});

describe("getPools", () => {
  it("success", async () => {
    const pools = await poolRepository.getPools();

    expect(pools).not.toBeNull();
  });
});

describe("getPoolDetail", () => {
  it("success", async () => {
    const pools = await poolRepository.getPoolDetailByPoolPath("");

    expect(pools).not.toBeNull();
  });
});

describe("getIncentivizePools", () => {
  it("requests incentivized pools without address by default", async () => {
    const networkClient = new MockNetworkClient();
    const repository = new PoolRepositoryImpl(networkClient, null, null);

    await repository.getIncentivizePools();

    expect(networkClient.getCalls).toEqual([
      {
        url: "/pools?incentivized=true",
      },
    ]);
  });

  it("adds an encoded address to the incentivized pool request", async () => {
    const networkClient = new MockNetworkClient();
    const repository = new PoolRepositoryImpl(networkClient, null, null);

    await repository.getIncentivizePools("g1abc/?:");

    expect(networkClient.getCalls).toEqual([
      {
        url: "/pools?incentivized=true&address=g1abc%2F%3F%3A",
      },
    ]);
  });
});

describe("getLiquidityTicksOfPoolByPath", () => {
  it("requests pool liquidity ticks and preserves liquidityNet strings", async () => {
    const liquidityNet = "340282366920938463463374607431768211456";
    const networkClient = new MockNetworkClient({
      data: [{ tick: 1, liquidityNet }],
    });
    const repository = new PoolRepositoryImpl(networkClient, null, null);

    const ticks = await repository.getLiquidityTicksOfPoolByPath("pool-1");

    expect(networkClient.getCalls).toEqual([
      {
        url: "/pools/pool-1/ticks",
      },
    ]);
    expect(ticks).toEqual([{ tick: 1, liquidityNet }]);
    expect(typeof ticks[0].liquidityNet).toBe("string");
  });
});
