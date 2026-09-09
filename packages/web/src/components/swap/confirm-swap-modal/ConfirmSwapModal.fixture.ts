import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";
import { SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapConfirmModalState } from "@states/swap";

export const readySwapModal: Extract<SwapConfirmModalState, { status: "ready" }> = {
  status: "ready",
  swapTokenInfo: {
    tokenA: GNOT_TOKEN,
    tokenB: GNS_TOKEN,
    tokenAAmount: "1",
    tokenBAmount: "2",
    tokenABalance: "10",
    tokenBBalance: "20",
    tokenAUSD: 1,
    tokenBUSD: 1,
    tokenAUSDStr: "$1",
    tokenBUSDStr: "$1",
    tokenAPriceGrade: "ORACLE",
    tokenBPriceGrade: "ORACLE",
    direction: "EXACT_IN",
    slippage: 0.5,
  },
  swapSummaryInfo: {
    tokenA: GNOT_TOKEN,
    tokenB: GNS_TOKEN,
    swapDirection: "EXACT_IN",
    swapRate: 2,
    swapRateUSD: 1,
    swapRate1USD: 1,
    priceImpact: 0,
    guaranteedAmount: { amount: 1.99, currency: "GNS" },
    gasFee: { amount: 0.001, currency: "GNOT" },
    gasFeeUSD: 0.001,
    swapRateAction: SwapRateAction.ATOB,
    protocolFee: "0.3%",
    routerFee: 0.003,
    gasEstimateSuccess: true,
  },
  isRefetching: false,
  estimatedAmount: "2",
  tokenAmountLimit: 1.99,
};
