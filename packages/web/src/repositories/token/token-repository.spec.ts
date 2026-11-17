import { MockStorageClient } from "@common/clients/storage-client/mock-storage-client";
import { NetworkClient } from "@common/clients/network-client";
import { TokenSearchLogModel } from "@models/token/token-search-log-model";
import { swapExtensions } from "@resources/swap-extension";
import { TokenRepositoryMock } from "./token-repository-mock";
import { TokenRepositoryImpl } from "./token-repository-impl";
import {
  IGrc20BalanceReceiptResponse,
  IGrc20BalanceReceiptWireResponse,
} from "./response/balance-by-address-response";

const localStorageClient = new MockStorageClient("LOCAL");
const tokenRepository = new TokenRepositoryMock(localStorageClient);

describe("getTokens", () => {
  it("success", async () => {
    const response = await tokenRepository.getTokens(true);

    expect(response).toBeTruthy();
    // expect(response.tokens).toBeTruthy();
    // expect(typeof response.tokens[0].path).toBe("string");
    // expect(typeof response.tokens[0].address).toBe("string");
    // expect(typeof response.tokens[0].priceID).toBe("string");
    // expect(typeof response.tokens[0].chainId).toBe("string");
    // expect(typeof response.tokens[0].name).toBe("string");
    // expect(typeof response.tokens[0].symbol).toBe("string");
    // expect(typeof response.tokens[0].decimals).toBe("number");
    // expect(typeof response.tokens[0].logoURI).toBe("string");
  });

  it.each([false, true])("requests token verification state %s", async showUnverified => {
    const networkClient = {
      get: jest.fn().mockResolvedValue({ data: { data: [] } }),
    } as unknown as NetworkClient;
    const repository = new TokenRepositoryImpl(networkClient, localStorageClient);

    await repository.getTokens(showUnverified);

    expect(networkClient.get).toHaveBeenCalledWith({
      url: `/token-metas?showUnverified=${showUnverified}`,
    });
  });
});

describe("getGrc20BalancesByAddress", () => {
  it.each([
    { path: "token", amount: "10", updatedBlockHeight: 100 },
    { path: "token", amount: "10" },
  ])("leaves the latest-balance request and optional metadata unchanged: %o", async balance => {
    const response = { message: "", data: [balance] };
    const get = jest.fn().mockResolvedValue({ data: response });
    const repository = new TokenRepositoryImpl({ get } as unknown as NetworkClient, localStorageClient);

    await expect(repository.getGrc20BalancesByAddress("g1user")).resolves.toEqual(response);
    expect(get).toHaveBeenCalledWith({ url: "/users/g1user/balances" });
  });

  it("keeps ordinary mock balances independent of receipts", async () => {
    await expect(tokenRepository.getGrc20BalancesByAddress("g1user")).resolves.toEqual({ message: "", data: [] });
  });
});

describe("getGrc20BalanceReceiptByAddress", () => {
  it.each(["7a", "ebKeJB6fEOh9BO2MJk1+aNdPmR5BEjVBavhbb42ZL/4="])(
    "requests the separate receipt route with an encoded hash %s",
    async txHash => {
      const response: IGrc20BalanceReceiptWireResponse = {
        message: "",
        data: {
          applied: true,
          balances: [{ path: "token", amount: "12", updatedBlockHeight: 100 }],
          balanceChanges: [{ path: "token", amount: "-2" }],
        },
      };
      const get = jest.fn().mockResolvedValue({ data: response });
      const repository = new TokenRepositoryImpl({ get } as unknown as NetworkClient, localStorageClient);

      await expect(repository.getGrc20BalanceReceiptByAddress("g1user", txHash)).resolves.toEqual({
        message: "",
        data: response.data.balances,
        accountBalanceApplied: true,
        balanceChanges: response.data.balanceChanges,
      });
      expect(get).toHaveBeenCalledWith({
        url: `/users/g1user/balances/receipts?txHash=${encodeURIComponent(txHash)}`,
      });
    },
  );

  it.each([
    {
      scenario: "applied receipt",
      response: {
        message: "Success",
        data: {
          applied: true,
          balances: [{ path: "token", amount: "12000000000000000001", updatedBlockHeight: 100 }],
          balanceChanges: [{ path: "token", amount: "-2000000000000000001" }],
        },
      },
      expected: {
        message: "Success",
        data: [{ path: "token", amount: "12000000000000000001", updatedBlockHeight: 100 }],
        accountBalanceApplied: true,
        balanceChanges: [{ path: "token", amount: "-2000000000000000001" }],
      },
    },
    {
      scenario: "pending receipt",
      response: { message: "Success", data: { applied: false, balances: [], balanceChanges: [] } },
      expected: { message: "Success", data: [], accountBalanceApplied: false, balanceChanges: [] },
    },
  ] satisfies {
    scenario: string;
    response: IGrc20BalanceReceiptWireResponse;
    expected: IGrc20BalanceReceiptResponse;
  }[])("normalizes $scenario at the repository boundary", async ({ response, expected }) => {
    const get = jest.fn().mockResolvedValue({ data: response });
    const repository = new TokenRepositoryImpl({ get } as unknown as NetworkClient, localStorageClient);

    await expect(repository.getGrc20BalanceReceiptByAddress("g1user", "7a")).resolves.toEqual(expected);
    expect(get).toHaveBeenCalledWith({ url: "/users/g1user/balances/receipts?txHash=7a" });
  });

  it.each([400, 404, 500])("propagates receipt HTTP %s without retrying ordinary balances", async status => {
    const error = Object.assign(new Error("receipt unavailable"), { response: { status } });
    const get = jest.fn().mockRejectedValue(error);
    const repository = new TokenRepositoryImpl({ get } as unknown as NetworkClient, localStorageClient);

    await expect(repository.getGrc20BalanceReceiptByAddress("g1user", "7a")).rejects.toBe(error);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith({ url: "/users/g1user/balances/receipts?txHash=7a" });
  });

  it("keeps mock receipts pending instead of inventing completion", async () => {
    await expect(tokenRepository.getGrc20BalanceReceiptByAddress("g1user", "tx")).resolves.toEqual({
      message: "",
      data: [],
      accountBalanceApplied: false,
      balanceChanges: [],
    });
  });
});

describe("token display metadata", () => {
  it("preserves the wrapped token symbol while exposing its extension display symbol", async () => {
    const extension = swapExtensions[0];
    const networkClient = {
      get: jest.fn().mockResolvedValue({
        data: {
          data: {
            path: extension.grc20WrappedTokenPath,
            symbol: "BUBBLE",
            displaySymbol: "BUBBLE",
          },
        },
      }),
    } as unknown as NetworkClient;
    const repository = new TokenRepositoryImpl(networkClient, localStorageClient);

    const token = await repository.getTokenByPath(extension.grc20WrappedTokenPath);

    expect(token).toMatchObject({
      symbol: "BUBBLE",
      displaySymbol: "wBUBBLE",
    });
  });
});

describe("getTokenPrices", () => {
  it("success", async () => {
    const response = await tokenRepository.getTokenPrices();

    expect(response).toBeTruthy();
    // expect(response.prices).toBeTruthy();
    // expect(typeof response.prices).toBe("object");
  });
});

describe("createSearchLog", () => {
  const defaultSearchLog: TokenSearchLogModel = {
    searchType: "POPULAR",
    changeRate: "-3.3",
    token: {
      path: "path",
      address: "address",
      type: "GRC20",
      priceID: "priceID",
      chainId: "chainId",
      name: "name",
      symbol: "symbol",
      displaySymbol: "symbol",
      decimals: 6,
      logoURI: "logoURI",
      createdAt: "",
    },
  };

  it("success", async () => {
    const searchLog = { ...defaultSearchLog };
    let beforeLogItemLength = 0;
    let afterLogItemLength = 0;
    let response = null;

    beforeLogItemLength = (await tokenRepository.getSearchLogs()).length;
    response = await tokenRepository.createSearchLog(searchLog);
    afterLogItemLength = (await tokenRepository.getSearchLogs()).length;

    expect(response).toBeTruthy();
    expect(beforeLogItemLength).toBe(0);
    expect(afterLogItemLength).toBe(1);
  });
});

describe("getSearchLogs", () => {
  const defaultSearchLog: TokenSearchLogModel = {
    searchType: "POPULAR",
    changeRate: "-3.3",
    token: {
      path: "path",
      address: "address",
      type: "GRC20",
      priceID: "priceID",
      chainId: "chainId",
      name: "name",
      symbol: "symbol",
      displaySymbol: "symbol",
      decimals: 6,
      logoURI: "logoURI",
      createdAt: "",
    },
  };

  it("success", async () => {
    const searchLog = { ...defaultSearchLog };
    [...new Array(5)].forEach(() => {
      tokenRepository.createSearchLog(searchLog);
    });

    const response = await tokenRepository.getSearchLogs();

    expect(response).toBeTruthy();
  });

  it("invalid storage is error", async () => {
    localStorageClient.get = jest.fn().mockReturnValue("Invalid ValueXXXXXX");
    let error = null;

    try {
      expect(await tokenRepository.getSearchLogs()).toThrowError();
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
  });
});
