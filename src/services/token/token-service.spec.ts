import { BigNumber } from "bignumber.js";
import { TokenError } from "@/common/errors/token";
import { TokenService } from "./token-service";
import {
	TokenRepository,
	TokenRepositoryMock,
	USDExchangeRateResponse,
} from "@/repositories/token";
import { StorageClient } from "@/common/clients/storage-client";
import { MockStorageClient } from "@/common/clients/storage-client/mock-storage-client";
import { isErrorResponse } from "@/common/utils/validation-util";
import { TokenMetaModel } from "@/models/token/token-meta-medel";
import { ExchangeRateModel } from "@/models/token/exchange-rate-model";
import { TokenDefaultModel } from "@/models/token/token-default-model";
import { TokenTableModel } from "@/models/datatable";
import {
	HighestRewardPoolModel,
	PopularTokenModel,
	RecentlyAddedPoolModel,
} from "@/models/statistical-data";

let localStorageClient: StorageClient;
let tokenRepository: TokenRepository;
let tokenService: TokenService;

beforeEach(() => {
	localStorageClient = new MockStorageClient("LOCAL");
	tokenRepository = new TokenRepositoryMock(localStorageClient);
	tokenService = new TokenService(tokenRepository);
	jest.clearAllMocks();
});

describe("Get all Token metas.", () => {
	it("Successful All token metadata lookup.", async () => {
		// given
		const spyFnAllTokenMetas = jest.spyOn(tokenRepository, "getAllTokenMetas");
		// when
		const response = await tokenService.getAllTokenMetas();
		const tokenMeta = response as TokenMetaModel;

		// then
		expect(response).toBeTruthy();
		expect(spyFnAllTokenMetas).toBeCalledTimes(1);
		expect(tokenMeta).not.toBeInstanceOf(TokenError);
		expect(tokenMeta).not.toBeNull();
		expect(Array.isArray(tokenMeta.tokens)).toBe(true);
		expect(tokenMeta.tokens).not.toBeNull();
		expect(tokenMeta.tokens.length).toBeGreaterThan(0);
	});

	it("Failed All token metadata lookup.", async () => {
		// given
		// occur error in repository
		tokenRepository.getAllTokenMetas = jest
			.fn()
			.mockRejectedValue(new TokenError("NOT_FOUND_TOKEN_METAS"));

		// when
		const response = await tokenService.getAllTokenMetas();

		// then
		expect(tokenRepository.getAllTokenMetas).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Get all Exchange rates by token.", () => {
	it("Successful get all exchange rates by token.", async () => {
		// given
		const spyFnAllExchangeRates = jest.spyOn(
			tokenRepository,
			"getAllExchangeRates",
		);
		const tokenId = "1";

		// when
		const response = await tokenService.getAllExchangeRates(tokenId);
		const exchangeRates = response as ExchangeRateModel;

		// then
		expect(response).toBeTruthy();
		expect(spyFnAllExchangeRates).toBeCalledTimes(1);
		expect(response).not.toBeInstanceOf(TokenError);
		expect(typeof exchangeRates.tokenId).toBe("string");
		expect(exchangeRates).not.toBeNull();
		expect(exchangeRates.tokenId).not.toBeNull();
		expect(exchangeRates.rates).not.toBeNull();
		expect(exchangeRates.rates.length).toBeGreaterThan(0);
	});

	it("Failed get all exchange rates by token.", async () => {
		// given
		const tokenId = "";
		// occur error in repository
		tokenRepository.getAllExchangeRates = jest
			.fn()
			.mockRejectedValue(new TokenError("NO_MATCH_TOKENID_FOR_EX_RATE"));

		// when
		const response = await tokenService.getAllExchangeRates(tokenId);

		// then
		expect(tokenRepository.getAllExchangeRates).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Get USD exchange rate by token.", () => {
	it("Successful get USD exchange rate by token.", async () => {
		// given
		const spyFnUSDExchangeRate = jest.spyOn(
			tokenRepository,
			"getUSDExchangeRate",
		);
		const tokenId = "1";

		// when
		const response = await tokenService.getUSDExchangeRate(tokenId);
		const usdRate = response as USDExchangeRateResponse;

		// then
		expect(response).toBeTruthy();
		expect(spyFnUSDExchangeRate).toBeCalledTimes(1);
		expect(response).not.toBeInstanceOf(TokenError);
		expect(typeof usdRate.rate).toBe("number");
		expect(usdRate.rate).not.toBeNull();
	});

	it("Failed get USD exchange rate by token.", async () => {
		// given
		const tokenId = "";
		// occur error in repository
		tokenRepository.getUSDExchangeRate = jest
			.fn()
			.mockRejectedValue(new TokenError("NO_MATCH_TOKENID_FOR_USD_RATE"));

		// when
		const response = await tokenService.getUSDExchangeRate(tokenId);

		// then
		expect(tokenRepository.getUSDExchangeRate).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Get token by tokenId.", () => {
	it("Successful get token by tokenId.", async () => {
		// given
		const spyFnTokenById = jest.spyOn(tokenRepository, "getTokenById");
		const tokenId = "1";

		// when
		const response = await tokenService.getTokenById(tokenId);
		const tokenModel = response as TokenDefaultModel;

		// then
		expect(response).toBeTruthy();
		expect(spyFnTokenById).toBeCalledTimes(1);
		expect(response).not.toBeInstanceOf(TokenError);
		expect(typeof tokenModel.tokenId).toBe("string");
		expect(typeof tokenModel.name).toBe("string");
		expect(typeof tokenModel.symbol).toBe("string");
		expect(typeof tokenModel.amount?.denom).toBe("string");
		expect(tokenModel.amount).toBeTruthy();
		expect(tokenModel.amount?.value).toBeInstanceOf(BigNumber);
		expect(tokenModel.tokenId).not.toBeNull();
		expect(tokenModel.name).not.toBeNull();
		expect(tokenModel.symbol).not.toBeNull();
	});

	it("Failed get token by tokenId.", async () => {
		// given
		const tokenId = "";
		// occur error in repository
		tokenRepository.getTokenById = jest
			.fn()
			.mockRejectedValue(new TokenError("NO_MATCH_TOKENID"));

		// when
		const response = await tokenService.getTokenById(tokenId);

		// then
		expect(tokenRepository.getTokenById).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Get token Datatable.", () => {
	it("Successful get All Type token Datatable.", async () => {
		// given
		const spyFnTokenDatatable = jest.spyOn(
			tokenRepository,
			"getTokenDatatable",
		);
		// when
		const response = await tokenService.getTokenDatatable();
		const tokenTable = response as TokenTableModel.TokenTableModel;

		// then
		expect(spyFnTokenDatatable).toBeCalledTimes(1);
		expect(tokenTable).not.toBeNull();
		expect(tokenTable?.hits).not.toBeNull();
		expect(tokenTable?.total).not.toBeNull();
		expect(tokenTable?.tokens).not.toBeNull();
		expect(tokenTable?.tokens.length).toBeGreaterThan(0);
	});

	it("Failed Get All Type token Datatable.", async () => {
		// given
		// occur error in repository
		tokenRepository.getTokenDatatable = jest
			.fn()
			.mockRejectedValue(new TokenError("NO_TOKEN_DATATABLE_TYPE_ALL"));

		// when
		const response = await tokenService.getTokenDatatable();

		// then
		expect(tokenRepository.getTokenDatatable).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Get popular tokens.", () => {
	it("Successful get popular tokens.", async () => {
		// given
		const spyFnPopularTokens = jest.spyOn(
			tokenRepository,
			"getSummaryPopularTokens",
		);

		// when
		const response = await tokenService.getPopularTokens();
		const popularTokens = response as PopularTokenModel.PopularTokenModel;

		// then
		expect(response).toBeTruthy();
		expect(spyFnPopularTokens).toBeCalledTimes(1);
		expect(popularTokens).not.toBeNull();
		expect(popularTokens?.hits).not.toBeNull();
		expect(popularTokens?.total).not.toBeNull();
		expect(popularTokens?.tokens).not.toBeNull();
		expect(popularTokens?.tokens.length).toBeGreaterThan(0);
	});

	it("Failed get popular tokens.", async () => {
		// given
		// occur error in repository
		tokenRepository.getSummaryPopularTokens = jest
			.fn()
			.mockRejectedValue(new TokenError("NOT_FOUND_POPULAR_TOKENS"));

		// when
		const response = await tokenService.getPopularTokens();

		// then
		expect(tokenRepository.getSummaryPopularTokens).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Get highest reward tokens.", () => {
	it("Successful get highest reward tokens.", async () => {
		// given
		const spyFnHighestRewardTokens = jest.spyOn(
			tokenRepository,
			"getSummaryHighestRewardTokens",
		);

		// when
		const response = await tokenService.getHighestRewardTokens();
		const highestTokens =
			response as HighestRewardPoolModel.HighestRewardPoolModel;

		// then
		expect(response).toBeTruthy();
		expect(spyFnHighestRewardTokens).toBeCalledTimes(1);
		expect(highestTokens).not.toBeNull();
		expect(highestTokens?.hits).not.toBeNull();
		expect(highestTokens?.total).not.toBeNull();
		expect(highestTokens?.pairs).not.toBeNull();
		expect(highestTokens?.pairs.length).toBeGreaterThan(0);
	});

	it("Failed get popular tokens.", async () => {
		// given
		// occur error in repository
		tokenRepository.getSummaryHighestRewardTokens = jest
			.fn()
			.mockRejectedValue(new TokenError("NOT_FOUND_HIGHEST_TOKENS"));

		// when
		const response = await tokenService.getHighestRewardTokens();

		// then
		expect(tokenRepository.getSummaryHighestRewardTokens).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Get recently added tokens.", () => {
	it("Successful get recently added tokens.", async () => {
		// given
		const spyFnRecentlyAddedTokens = jest.spyOn(
			tokenRepository,
			"getSummaryRecentlyAddedTokens",
		);

		// when
		const response = await tokenService.getRecentlyAddedTokens();
		const recentlyTokens =
			response as RecentlyAddedPoolModel.RecentlyAddedPoolModel;

		// then
		expect(response).toBeTruthy();
		expect(spyFnRecentlyAddedTokens).toBeCalledTimes(1);
		expect(recentlyTokens).not.toBeNull();
		expect(recentlyTokens?.hits).not.toBeNull();
		expect(recentlyTokens?.total).not.toBeNull();
		expect(recentlyTokens?.pairs).not.toBeNull();
		expect(recentlyTokens?.pairs.length).toBeGreaterThan(0);
	});

	it("Failed get recently added tokens.", async () => {
		// given
		// occur error in repository
		tokenRepository.getSummaryRecentlyAddedTokens = jest
			.fn()
			.mockRejectedValue(new TokenError("NOT_FOUND_RECENTLY_TOKENS"));

		// when
		const response = await tokenService.getRecentlyAddedTokens();

		// then
		expect(tokenRepository.getSummaryRecentlyAddedTokens).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Search Tokens.", () => {
	it("Successful search keyword", async () => {
		// given
		// when
		// then
	});
});

export {};
