import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import React from "react";

import { useAddress } from "@hooks/common/use-address";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useSelectPool } from "@hooks/pool/data/use-select-pool";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { initialPool } from "@models/pool/pool-model";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { useGetRoutes } from "@query/router";
import { IncreaseState } from "@states/index";
import { tickToPrice } from "@utils/swap-utils";
import { useRepositionHandle } from "./use-reposition-handle";

jest.mock("@states/index", () => {
  const { atom } = jest.requireActual("jotai");
  return { IncreaseState: { selectedPosition: atom(null) } };
});
jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({
    getPoolPath: () => "token-a:token-b:3000",
    getPositionId: () => "1",
    back: jest.fn(),
    push: jest.fn(),
  }),
}));
jest.mock("@hooks/common/use-address", () => ({ useAddress: jest.fn() }));
jest.mock("@hooks/common/use-broadcast-handler", () => ({
  useBroadcastHandler: () => ({
    broadcastError: jest.fn(),
    broadcastSuccess: jest.fn(),
    broadcastRejected: jest.fn(),
  }),
}));
jest.mock("@hooks/common/use-gnoswap-context", () => ({ useGnoswapContext: jest.fn() }));
jest.mock("@hooks/common/use-invalidate-queries", () => ({
  useInvalidateQueries: () => ({ invalidateQueryKey: jest.fn() }),
}));
jest.mock("@hooks/common/use-message", () => ({ useMessage: () => ({ getMessage: jest.fn() }) }));
jest.mock("@hooks/common/use-referral", () => ({ useReferral: () => ({ getNextReferralAddress: () => null }) }));
jest.mock("@hooks/common/use-slippage", () => ({ useSlippage: () => ({ slippage: 0.5, changeSlippage: jest.fn() }) }));
jest.mock("@hooks/common/use-transaction-confirm-modal", () => ({
  useTransactionConfirmModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/common/use-transaction-event-store", () => ({
  useTransactionEventStore: () => ({ enqueueEvent: jest.fn() }),
}));
jest.mock("@hooks/pool/data/use-position-data", () => ({ usePositionData: jest.fn() }));
jest.mock("@hooks/pool/data/use-select-pool", () => ({ useSelectPool: jest.fn() }));
jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ getGnotPath: (token: TokenModel) => token }),
}));
jest.mock("@hooks/token/data/use-token-amount-input", () => ({
  useTokenAmountInput: () => ({ amount: "0", changeAmount: jest.fn() }),
}));
jest.mock("@hooks/token/data/use-token-data", () => ({ useTokenData: jest.fn() }));
jest.mock("@hooks/wallet/data/use-wallet", () => ({ useWallet: jest.fn() }));
jest.mock("@query/router", () => ({ useGetRoutes: jest.fn() }));

const poolPath = "token-a:token-b:3000";
const tokenA: TokenModel = {
  ...initialPool.tokenA,
  path: "token-a",
  type: "GRC20",
  name: "Token A",
  symbol: "TKA",
  displaySymbol: "TKA",
  decimals: 6,
  priceID: "token-a",
};
const tokenB: TokenModel = {
  ...initialPool.tokenB,
  path: "token-b",
  type: "GRC20",
  name: "Token B",
  symbol: "TKB",
  displaySymbol: "TKB",
  decimals: 6,
  priceID: "token-b",
};
const position: PoolPositionModel = {
  id: 1,
  lpTokenId: "1",
  poolPath,
  feeTier: "FEE_3000",
  staked: false,
  owner: "g1owner",
  tickLower: -100,
  tickUpper: 100,
  liquidity: 10000000000000n,
  tokenABalance: "196678919822",
  tokenBBalance: "813141175833",
  positionUsdValue: "0",
  unclaimedFeeAAmount: "0",
  unclaimedFeeBAmount: "0",
  apr: "0",
  stakedAt: "",
  rewards: [],
  claimedRewards: [],
  closed: false,
  totalClaimedUsd: "0",
  usdValue: 0,
  tokenUri: "",
  totalDailyRewardsUsd: "0",
  stakedUsdValue: "0",
  pool: {
    ...initialPool,
    poolPath,
    tokenA,
    tokenB,
    fee: "3000",
    currentTick: 0,
    tickSpacing: 1,
    price: 1,
  },
};
const poolState = {
  poolPath,
  feeTier: "FEE_3000",
  tickSpacing: 1,
  compareToken: tokenA,
  currentPrice: 1,
  minPrice: tickToPrice(position.tickLower),
  maxPrice: tickToPrice(position.tickUpper),
  sqrtPriceX96: 79228162514264337593543950336n,
  depositRatio: null,
  feeBoost: null,
  isLoading: false,
  isChangeMinMax: false,
  setMinPosition: jest.fn(),
  setMaxPosition: jest.fn(),
  resetRange: jest.fn(),
  setIsChangeMinMax: jest.fn(),
  setFullRange: jest.fn(),
};
const mockRepositionLiquidity = jest.fn();

function renderReposition(fallbackPosition: PoolPositionModel) {
  const store = createStore();
  store.set(IncreaseState.selectedPosition, fallbackPosition);
  return renderHook(() => useRepositionHandle(), {
    wrapper: ({ children }: React.PropsWithChildren) => <Provider store={store}>{children}</Provider>,
  });
}

describe("useRepositionHandle raw position units", () => {
  beforeEach(() => {
    (useAddress as jest.Mock).mockReturnValue({ address: "g1owner" });
    (useGnoswapContext as jest.Mock).mockReturnValue({
      positionRepository: { repositionLiquidity: mockRepositionLiquidity },
      swapRouterRepository: { sendExactInSwapRoute: jest.fn(), sendExactOutSwapRoute: jest.fn() },
    });
    (usePositionData as jest.Mock).mockReset().mockReturnValue({ positions: [], loading: true, refetch: jest.fn() });
    (useSelectPool as jest.Mock).mockReturnValue(poolState);
    (useTokenData as jest.Mock).mockReturnValue({ tokens: [], isFetched: true, updateBalances: jest.fn() });
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      account: { address: "g1owner" },
      walletClient: { getWalletType: () => "ADENA" },
    });
    (useGetRoutes as jest.Mock).mockReturnValue({ data: undefined, isLoading: false, isError: false });
    mockRepositionLiquidity.mockReset().mockResolvedValue(null);
  });

  it("keeps display amounts unchanged from the raw shared fallback through fetched positions and submits display quantities", async () => {
    const { result, rerender } = renderReposition(position);

    expect(result.current.selectedPosition).toBe(position);
    expect(result.current.currentAmounts).toEqual({ amountA: "196678.919822", amountB: "813141.175833" });
    expect(result.current.repositionAmounts).toEqual({ amountA: "196678.919822", amountB: "813141.175833" });

    await act(async () => {
      await result.current.reposition(null, null);
    });

    expect(mockRepositionLiquidity).toHaveBeenCalledTimes(1);
    expect(mockRepositionLiquidity).toHaveBeenCalledWith(
      expect.objectContaining({
        lpTokenId: "1",
        tokenAAmount: "196678.919822",
        tokenBAmount: "813141.175833",
        caller: "g1owner",
      }),
    );

    (usePositionData as jest.Mock).mockReturnValue({ positions: [position], loading: false, refetch: jest.fn() });
    rerender();

    expect(result.current.selectedPosition).toBe(position);
    expect(result.current.currentAmounts).toEqual({ amountA: "196678.919822", amountB: "813141.175833" });
    expect(result.current.repositionAmounts).toEqual({ amountA: "196678.919822", amountB: "813141.175833" });
  });
});
