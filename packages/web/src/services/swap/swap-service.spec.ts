import { ExactTypeOption } from "@/common/values/data-constant";
import { TokenDefaultModel } from "@/models/token/token-default-model";
import { SwapRepositoryMock } from "@/repositories/swap";
import { SwapService } from "./swap-service";
import BigNumber from "bignumber.js";
import { SwapError } from "@/common/errors/swap";
import { isErrorResponse } from "@/common/utils/validation-util";
import { SwapExpectedResultModel } from "@/models/swap/swap-expected-result-model";
import { SwapConfirmSuccessModel } from "@/models/swap/swap-confirm-model";

const swapRepository = new SwapRepositoryMock();
const swapService = new SwapService(swapRepository);

beforeEach(() => {
	jest.clearAllMocks();
});

describe("Get swap rate.", () => {
	it("Successful get swap rate.", async () => {
		// given
		const spyFnGetSwapRate = jest.spyOn(swapRepository, "getSwapRate");
		const token0: TokenDefaultModel = {
			tokenId: "1",
			name: "Gnoswap",
			symbol: "GNOSWAP",
			amount: {
				value: BigNumber(2000),
				denom: "gnosh",
			},
		};
		const token1: TokenDefaultModel = {
			tokenId: "2",
			name: "Gnoland",
			symbol: "GNO.LAND",
			amount: {
				value: BigNumber(1000),
				denom: "ugnot",
			},
		};
		const type: ExactTypeOption = "EXACT_IN";

		// when
		const response = await swapService.getSwapRate(token0, token1, type);

		// then
		expect(response).toBeTruthy();
		expect(spyFnGetSwapRate).toBeCalledTimes(1);
		expect(response).toBeInstanceOf(BigNumber);
		expect(response).not.toBeNull();
	});

	it("Failed get swap rate.", async () => {
		// given
		const token0: TokenDefaultModel = {
			tokenId: "",
			name: "Gnoswap",
			symbol: "GNOSWAP",
		};
		const token1: TokenDefaultModel = {
			tokenId: "",
			name: "Gnoland",
			symbol: "GNO.LAND",
		};
		const type: ExactTypeOption = "EXACT_IN";

		// occur error in repository
		swapRepository.getSwapRate = jest
			.fn()
			.mockRejectedValue(new SwapError("SWAP_RATE_LOOKUP_FAILED"));

		// when
		const response = await swapService.getSwapRate(token0, token1, type);

		// then
		expect(swapRepository.getSwapRate).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Get expected swap result.", () => {
	it("Successful expected swap result.", async () => {
		// given
		const spyFnGetExpectedSwapResult = jest.spyOn(
			swapRepository,
			"getExpectedSwapResult",
		);
		const token0: TokenDefaultModel = {
			tokenId: "1",
			name: "Gnoswap",
			symbol: "GNOSWAP",
			amount: {
				value: BigNumber(2000),
				denom: "gnosh",
			},
		};
		const token1: TokenDefaultModel = {
			tokenId: "2",
			name: "Gnoland",
			symbol: "GNO.LAND",
			amount: {
				value: BigNumber(1000),
				denom: "ugnot",
			},
		};
		const type: ExactTypeOption = "EXACT_IN";

		// when
		const response = await swapService.getExpectedSwapResult(
			token0,
			token1,
			type,
		);
		const expectedSwap = response as SwapExpectedResultModel;

		// then
		expect(response).toBeTruthy();
		expect(spyFnGetExpectedSwapResult).toBeCalledTimes(1);
		expect(typeof expectedSwap.priceImpact).toBe("number");
		expect(expectedSwap.minReceived).toBeInstanceOf(BigNumber);
		expect(expectedSwap.gasFee).toBeInstanceOf(BigNumber);
		expect(typeof expectedSwap.priceImpact).not.toBeNull();
		expect(expectedSwap.minReceived).not.toBeNull();
		expect(expectedSwap.gasFee).not.toBeNull();
	});

	it("Failed expected swap result.", async () => {
		// given
		const token0: TokenDefaultModel = {
			tokenId: "",
			name: "Gnoswap",
			symbol: "GNOSWAP",
		};
		const token1: TokenDefaultModel = {
			tokenId: "",
			name: "Gnoland",
			symbol: "GNO.LAND",
		};
		const type: ExactTypeOption = "EXACT_IN";

		// occur error in repository
		swapRepository.getExpectedSwapResult = jest
			.fn()
			.mockRejectedValue(new SwapError("EXPECTED_RESULT_LOOKUP_FAILED"));

		// when
		const response = await swapService.getExpectedSwapResult(
			token0,
			token1,
			type,
		);

		// then
		expect(swapRepository.getExpectedSwapResult).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});

describe("Confirm swap.", () => {
	it("Successful confirm swap.", async () => {
		// given
		const spyFnSwap = jest.spyOn(swapRepository, "swap");
		const tokenPair = {
			token0: {
				tokenId: "1",
				name: "Gnoswap",
				symbol: "GNOSWAP",
				amount: {
					value: BigNumber(2000),
					denom: "gnosh",
				},
			},
			token1: {
				tokenId: "2",
				name: "Gnoland",
				symbol: "GNO.LAND",
				amount: {
					value: BigNumber(1000),
					denom: "ugnot",
				},
			},
		};
		const type: ExactTypeOption = "EXACT_IN";
		const slippage = 10;
		const gasFee = BigNumber(100);

		// when
		const response = await swapService.confirmSwap({
			tokenPair,
			type,
			slippage,
			gasFee,
		});
		const swap = response as SwapConfirmSuccessModel;

		// then
		expect(response).toBeTruthy();
		expect(spyFnSwap).toBeCalledTimes(1);
		expect(swap).not.toBeNull();
		expect(typeof swap.txHash).toBe("string");
		expect(swap.txHash).not.toBeNull();
	});

	it("Failed confirm swap.", async () => {
		// given
		const tokenPair = {
			token0: {
				tokenId: "",
				name: "Gnoswap",
				symbol: "GNOSWAP",
			},
			token1: {
				tokenId: "",
				name: "Gnoland",
				symbol: "GNO.LAND",
			},
		};
		const type: ExactTypeOption = "EXACT_IN";
		const slippage = 10;
		const gasFee = BigNumber(100);

		// occur error in repository
		swapRepository.swap = jest
			.fn()
			.mockRejectedValue(new SwapError("SWAP_FAILED"));

		// when
		const response = await swapService.confirmSwap({
			tokenPair,
			type,
			slippage,
			gasFee,
		});

		//then
		expect(swapRepository.swap).toBeCalledTimes(1);
		expect(isErrorResponse(response)).toBe(true);
	});
});
