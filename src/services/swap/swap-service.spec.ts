import { SwapRepositoryMock } from "@/repositories/swap";
import { SwapService } from "./swap-service";
import BigNumber from "bignumber.js";

const swapRepository = new SwapRepositoryMock();
const swapService = new SwapService(swapRepository);

beforeEach(() => {
	jest.clearAllMocks();
});

describe("-", () => {
	it("", () => {});
});

export {};
