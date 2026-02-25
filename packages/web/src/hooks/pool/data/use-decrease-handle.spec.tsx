import { renderHook } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <JotaiProvider>
    <GnoswapThemeProvider>
      {children}
    </GnoswapThemeProvider>
  </JotaiProvider>
);

const mockPositions: unknown[] = [];
let mockSelectedPosition: unknown = null;

jest.mock("jotai", () => {
  const actual = jest.requireActual("jotai");
  return {
    ...actual,
    useAtom: () => [mockSelectedPosition, jest.fn()],
  };
});

jest.mock("@hooks/common/use-custom-router", () => () => ({
  getPoolPath: () => "tokenA:tokenB:3000",
  getPositionId: () => "1",
  push: jest.fn(),
  movePageWithPoolPath: jest.fn(),
}));

jest.mock("@hooks/pool/data/use-position-data", () => ({
  usePositionData: () => ({
    positions: mockPositions,
    refetch: jest.fn(),
  }),
}));

jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({
    getGnotPath: (token: { name: string; symbol: string; logoURI: string }) => token,
  }),
}));

jest.mock("@hooks/token/data/use-token-amount-input", () => ({
  useTokenAmountInput: () => ({
    amount: "0",
    balance: "0",
    changeAmount: jest.fn(),
  }),
}));

jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({
    tokenPrices: {},
  }),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({
    connected: true,
    account: { address: "g1test" },
    loadingConnect: "done",
  }),
}));

jest.mock("@utils/swap-utils", () => ({
  tickToPrice: (tick: number) => tick,
  tickToPriceStr: (tick: number) => `${tick}`,
  isEndTickBy: () => false,
  getDepositAmountsByLiquidity: () => ({ amountA: "0", amountB: "0" }),
}));

jest.mock("@utils/token-utils", () => ({
  makeDisplayTokenAmount: () => 0,
}));

jest.mock("@utils/common", () => ({
  checkGnotPath: (path: string) => path,
}));

jest.mock("@utils/new-number-utils", () => ({
  formatOtherPrice: (val: number) => `$${val}`,
}));

jest.mock("@hooks/pool/data/use-select-pool", () => ({
  useSelectPool: () => ({
    depositRatio: null,
    feeBoost: null,
    compareToken: null,
    selectedFullRange: false,
  }),
}));

import { useDecreaseHandle } from "./use-decrease-handle";

function makePosition(currentTick: number, tickLower: number, tickUpper: number, closed = false) {
  return {
    lpTokenId: 1,
    tickLower,
    tickUpper,
    closed,
    liquidity: "1000",
    tokenABalance: "100",
    tokenBBalance: "200",
    unclaimedFeeAAmount: "0",
    unclaimedFeeBAmount: "0",
    rewards: [],
    pool: {
      currentTick,
      fee: "3000",
      tokenA: { path: "tokenA", name: "TokenA", symbol: "TA", logoURI: "", decimals: 6, priceID: "tokenA" },
      tokenB: { path: "tokenB", name: "TokenB", symbol: "TB", logoURI: "", decimals: 6, priceID: "tokenB" },
    },
  };
}

describe("useDecreaseHandle — derived values", () => {
  afterEach(() => {
    mockSelectedPosition = null;
    mockPositions.length = 0;
  });

  describe("loading", () => {
    it("returns true when selectedPosition is null", () => {
      mockSelectedPosition = null;
      const { result } = renderHook(() => useDecreaseHandle(), { wrapper });
      expect(result.current.loading).toBe(true);
    });

    it("returns false when selectedPosition exists", () => {
      mockSelectedPosition = makePosition(100, 50, 150);
      const { result } = renderHook(() => useDecreaseHandle(), { wrapper });
      expect(result.current.loading).toBe(false);
    });
  });
});
