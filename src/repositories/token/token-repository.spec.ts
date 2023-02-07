import { TokenRepositoryMock } from "./token-repository-mock";

const tokenRepository = new TokenRepositoryMock();

describe("getAllTokenMetas", () => {
	it("success", async () => {
		const response = await tokenRepository.getAllTokenMetas();

		expect(response).toBeTruthy();
		expect(response.tokens).toBeTruthy();
		expect(response.tokens).toHaveLength(3);
	});
});

describe("getExchangeRateByTokenId", () => {
	it("tokenId 1 exchange rate is 1", async () => {
		const tokenId = "1";

		const response = await tokenRepository.getExchangeRateByTokenId(tokenId);

		expect(response).toBeTruthy();
		expect(response.rate).toBeTruthy();
		expect(response.rate).toBe(1);
	});

	it("tokenId 2 exchange rate is 1.4", async () => {
		const tokenId = "2";

		const response = await tokenRepository.getExchangeRateByTokenId(tokenId);

		expect(response).toBeTruthy();
		expect(response.rate).toBeTruthy();
		expect(response.rate).toBe(1.4);
	});

	it("tokenId 3 exchange rate is 0.7", async () => {
		const tokenId = "3";

		const response = await tokenRepository.getExchangeRateByTokenId(tokenId);

		expect(response).toBeTruthy();
		expect(response.rate).toBeTruthy();
		expect(response.rate).toBe(0.7);
	});

	it("tokenId 4 is not found error", async () => {
		const tokenId = "4";
		let error;

		try {
			const response = await tokenRepository.getExchangeRateByTokenId(tokenId);
		} catch (e) {
			error = e;
		}

		expect(error).toBeTruthy();
	});
});

export {};
