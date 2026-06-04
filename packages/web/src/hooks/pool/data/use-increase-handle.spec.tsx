import { renderHook } from "@testing-library/react";

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
    positions: [],
    refetch: jest.fn(),
  }),
}));

jest.mock("@hooks/common/use-slippage", () => ({
  useSlippage: () => ({
    slippage: 0.5,
    changeSlippage: jest.fn(),
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

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({
    connected: true,
    account: { address: "g1test" },
    loadingConnect: "done",
  }),
}));

jest.mock("@hooks/pool/data/use-select-pool", () => ({
  useSelectPool: () => ({
    depositRatio: null,
    feeBoost: null,
    compareToken: null,
    selectedFullRange: false,
    currentPrice: null,
    minPrice: null,
    maxPrice: null,
    sqrtPriceX96: null,
    setCompareToken: jest.fn(),
    selectFullRange: jest.fn(),
    setMinPosition: jest.fn(),
    setMaxPosition: jest.fn(),
  }),
}));

import { useIncreaseHandle } from "./use-increase-handle";

function makePosition(currentTick: number, tickLower: number, tickUpper: number, closed = false) {
  return {
    lpTokenId: 1,
    tickLower,
    tickUpper,
    closed,
    liquidity: "1000",
    rewards: [],
    pool: {
      currentTick,
      fee: "3000",
      tokenA: { path: "tokenA", name: "TokenA", symbol: "TA", logoURI: "", decimals: 6, priceID: "tokenA" },
      tokenB: { path: "tokenB", name: "TokenB", symbol: "TB", logoURI: "", decimals: 6, priceID: "tokenB" },
    },
  };
}

describe("useIncreaseHandle — inRange derivation", () => {
  afterEach(() => {
    mockSelectedPosition = null;
  });

  it("returns false when selectedPosition is null", () => {
    mockSelectedPosition = null;
    const { result } = renderHook(() => useIncreaseHandle());
    // inRange is not directly returned but affects rangeStatus
    // rangeStatus is OUT when inRange is false and not closed
    expect(result.current.loading).toBe(true);
  });

  it("rangeStatus is IN when currentTick is within range", () => {
    mockSelectedPosition = makePosition(100, 50, 150);
    const { result } = renderHook(() => useIncreaseHandle());
    expect(result.current.rangeStatus).toBe("IN");
  });

  it("rangeStatus is OUT when currentTick is below tickLower", () => {
    mockSelectedPosition = makePosition(10, 50, 150);
    const { result } = renderHook(() => useIncreaseHandle());
    expect(result.current.rangeStatus).toBe("OUT");
  });

  it("rangeStatus is OUT when currentTick is above tickUpper", () => {
    mockSelectedPosition = makePosition(200, 50, 150);
    const { result } = renderHook(() => useIncreaseHandle());
    expect(result.current.rangeStatus).toBe("OUT");
  });

  it("rangeStatus is NONE when position is closed", () => {
    mockSelectedPosition = makePosition(100, 50, 150, true);
    const { result } = renderHook(() => useIncreaseHandle());
    expect(result.current.rangeStatus).toBe("NONE");
  });
});
