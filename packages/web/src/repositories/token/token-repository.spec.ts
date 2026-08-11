import { MockStorageClient } from "@common/clients/storage-client/mock-storage-client";
import { NetworkClient } from "@common/clients/network-client";
import { TokenSearchLogModel } from "@models/token/token-search-log-model";
import { TokenRepositoryMock } from "./token-repository-mock";
import { TokenRepositoryImpl } from "./token-repository-impl";

jest.mock("@containers/select-token-container/SelectTokenContainer", () => ({
  customSort: () => 0,
}));

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
