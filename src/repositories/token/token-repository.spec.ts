import { MockStorageClient } from "@/common/clients/storage-client/mock-storage-client";
import { TokenRepositoryMock } from "./token-repository-mock";

const tokenRepository = new TokenRepositoryMock(new MockStorageClient("LOCAL"));

describe("getAllTokenMetas", () => {
	it("success", async () => {
		const response = await tokenRepository.getAllTokenMetas();

		expect(response).toBeTruthy();
		expect(response.tokens).toBeTruthy();
		expect(response.tokens).toHaveLength(3);
	});
});

describe("getAllExchangeRates", () => {
	it("tokenId 1 exchange rate is 1", async () => {
		const tokenId = "1";

		const response = await tokenRepository.getAllExchangeRates(tokenId);

		expect(response).toBeTruthy();
		expect(response.rates).toBeTruthy();
	});
});

export {};
