import { StorageClient } from "@common/clients/storage-client";
import { MockStorageClient } from "@common/clients/storage-client/mock-storage-client";
import BigNumber from "bignumber.js";
import { TokenRepository } from "./token-repository";
import { TokenRepositoryMock } from "./token-repository-mock";

let tokenRepository: TokenRepository;
let localStorageClient: StorageClient;
beforeEach(() => {
  localStorageClient = new MockStorageClient("LOCAL");
  tokenRepository = new TokenRepositoryMock(localStorageClient);
});

describe("getAllTokenMetas", () => {
  it("success", async () => {
    const response = await tokenRepository.getAllTokenMetas();

    expect(response).toBeTruthy();
    expect(response.tokens).toBeTruthy();
    expect(response.tokens).toHaveLength(3);
    expect(typeof response.tokens[0].token_id).toBe("string");
    expect(typeof response.tokens[0].name).toBe("string");
    expect(typeof response.tokens[0].symbol).toBe("string");
    expect(typeof response.tokens[0].denom).toBe("string");
    expect(typeof response.tokens[0].minimal_denom).toBe("string");
    expect(typeof response.tokens[0].decimals).toBe("number");
  });
});

describe("searchTokens", () => {
  it("search to empty is success", async () => {
    const keyword = "";

    const response = await tokenRepository.searchTokens(keyword);

    expect(response).toBeTruthy();
    expect(response.items).toBeTruthy();
    expect(response.items.length).toBeGreaterThan(0);
    expect(typeof response.items[0].change_rate).toBe("number");
    expect(typeof response.items[0].search_type).toBe("string");
    expect(typeof response.items[0].token).toBe("object");
  });

  it("search to keyword is success", async () => {
    const keyword = "GNO";

    const response = await tokenRepository.searchTokens(keyword);

    expect(response).toBeTruthy();
    expect(response.items).toBeTruthy();
    expect(response.items.length).toBeGreaterThan(0);
    expect(typeof response.items[0].change_rate).toBe("number");
    expect(typeof response.items[0].search_type).toBe("string");
    expect(typeof response.items[0].token).toBe("object");
  });
});

describe("createSearchLog", () => {
  const defaultSearchLog = {
    searchType: "POPULAR",
    changeRate: BigNumber(-3.3),
    token: {
      tokenId: "1",
      name: "GNOT",
      symbol: "GNOLAND",
      amount: {
        value: BigNumber(100),
        denom: "GNOT",
      },
    },
  };

  it("success", async () => {
    const searchLog = { ...defaultSearchLog };
    let beforeLogItemLength = 0;
    let afterLogItemLength = 0;
    let response = null;

    beforeLogItemLength = tokenRepository.getSearchLogs().items.length;
    response = tokenRepository.createSearchLog(searchLog);
    afterLogItemLength = tokenRepository.getSearchLogs().items.length;

    expect(response).toBeTruthy();
    expect(beforeLogItemLength).toBe(0);
    expect(afterLogItemLength).toBe(1);
  });

  it("max length 10 is success", async () => {
    const searchLog = { ...defaultSearchLog };

    [...new Array(20)].forEach(_ => {
      tokenRepository.createSearchLog(searchLog);
    });

    expect(tokenRepository.getSearchLogs().items.length).toBe(10);
  });
});

describe("getSearchLogs", () => {
  const defaultSearchLog = {
    searchType: "POPULAR",
    changeRate: BigNumber(-3.3),
    token: {
      tokenId: "1",
      name: "GNOT",
      symbol: "GNOLAND",
      amount: {
        value: BigNumber(100),
        denom: "GNOT",
      },
    },
  };

  it("success", async () => {
    const searchLog = { ...defaultSearchLog };
    [...new Array(5)].forEach(_ => {
      tokenRepository.createSearchLog(searchLog);
    });

    const response = tokenRepository.getSearchLogs();

    expect(response).toBeTruthy();
    expect(response.items).toBeTruthy();
    expect(response.items.length).toBe(5);
    expect(typeof response.items[0].changeRate).toBe("string");
    expect(typeof response.items[0].searchType).toBe("string");
    expect(typeof response.items[0].token).toBe("object");
  });

  it("invalid storage is error", async () => {
    localStorageClient.get = jest.fn().mockReturnValue("Invalid ValueXXXXXX");
    let error = null;

    try {
      expect(tokenRepository.getSearchLogs()).toThrowError();
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
  });
});

describe("getAllExchangeRates", () => {
  it("tokenId 1 exchange rate is 1", async () => {
    const tokenId = "1";

    const response = await tokenRepository.getAllExchangeRates(tokenId);

    expect(response).toBeTruthy();
    expect(response.rates).toBeTruthy();
    expect(response.rates).toHaveLength(3);
    expect(typeof response.rates[0].token_id).toBe("string");
    expect(typeof response.rates[0].rate).toBe("number");
  });
});

describe("getUSDExchangeRate", () => {
  it("success", async () => {
    const tokenId = "1";

    const response = await tokenRepository.getUSDExchangeRate(tokenId);

    expect(response).toBeTruthy();
    expect(typeof response.rate).toBe("number");
  });
});

describe("getTokenDatatable", () => {
  it("success", async () => {
    const response = await tokenRepository.getTokenDatatable();

    expect(response).toBeTruthy();
    expect(response.tokens).toBeTruthy();
    expect(response.tokens.length).toBeGreaterThan(0);
    expect(typeof response.tokens[0].token_id).toBe("string");
    expect(typeof response.tokens[0].name).toBe("string");
    expect(typeof response.tokens[0].type).toBe("string");
    expect(typeof response.tokens[0].symbol).toBe("string");
    expect(typeof response.tokens[0].price).toBe("number");
    expect(typeof response.tokens[0].price_of_1h).toBe("number");
    expect(typeof response.tokens[0].price_of_24h).toBe("number");
    expect(typeof response.tokens[0].price_of_7d).toBe("number");
    expect(typeof response.tokens[0].m_cap).toBe("number");
    expect(typeof response.tokens[0].tvl).toBe("number");
    expect(typeof response.tokens[0].volume).toBe("number");
    expect(typeof response.tokens[0].most_liquidity_pool).toBe("object");
    expect(typeof response.tokens[0].graph).toBe("object");
  });
});

describe("getSummaryPopularTokens", () => {
  it("success", async () => {
    const response = await tokenRepository.getSummaryPopularTokens();

    expect(response).toBeTruthy();
    expect(response.tokens).toBeTruthy();
    expect(response.tokens.length).toBeGreaterThan(0);
    expect(typeof response.tokens[0].token_id).toBe("string");
    expect(typeof response.tokens[0].name).toBe("string");
    expect(typeof response.tokens[0].symbol).toBe("string");
    expect(typeof response.tokens[0].change_24h).toBe("number");
  });
});

describe("getSummaryHighestRewardTokens", () => {
  it("success", async () => {
    const response = await tokenRepository.getSummaryHighestRewardTokens();

    expect(response).toBeTruthy();
    expect(response.pairs).toBeTruthy();
    expect(response.pairs.length).toBeGreaterThan(0);
    expect(typeof response.pairs[0].pool_id).toBe("string");
    expect(typeof response.pairs[0].fee_tier).toBe("number");
    expect(typeof response.pairs[0].apr).toBe("number");
    expect(typeof response.pairs[0].token0).toBe("object");
    expect(typeof response.pairs[0].token1).toBe("object");
  });
});

describe("getSummaryRecentlyAddedTokens", () => {
  it("success", async () => {
    const response = await tokenRepository.getSummaryRecentlyAddedTokens();

    expect(response).toBeTruthy();
    expect(response.pairs).toBeTruthy();
    expect(response.pairs.length).toBeGreaterThan(0);
    expect(typeof response.pairs[0].pool_id).toBe("string");
    expect(typeof response.pairs[0].fee_tier).toBe("number");
    expect(typeof response.pairs[0].apr).toBe("number");
    expect(typeof response.pairs[0].token0).toBe("object");
    expect(typeof response.pairs[0].token1).toBe("object");
  });
});

describe("getTokenById", () => {
  it("success", async () => {
    const tokenId = "1";

    const response = await tokenRepository.getTokenById(tokenId);

    expect(response).toBeTruthy();
    expect(typeof response.token_id).toBe("string");
    expect(typeof response.name).toBe("string");
    expect(typeof response.symbol).toBe("string");
    expect(typeof response.amount).toBe("object");
  });

  it("not exists token is error", async () => {
    const tokenId = "";
    let error = null;

    try {
      expect(await tokenRepository.getTokenById(tokenId)).toThrowError();
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
  });
});
