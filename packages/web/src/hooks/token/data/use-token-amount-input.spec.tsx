import { renderHook, act } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { useTokenAmountInput } from "./use-token-amount-input";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <JotaiProvider>
    <GnoswapThemeProvider>
      {children}
    </GnoswapThemeProvider>
  </JotaiProvider>
);

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({
    connected: true,
    isSwitchNetwork: false,
  }),
}));

const mockDisplayBalanceMap: Record<string, string> = {};
const mockTokenPrices: Record<string, { usd: number }> = {};

jest.mock("./use-token-data", () => ({
  useTokenData: () => ({
    displayBalanceMap: mockDisplayBalanceMap,
    tokenPrices: mockTokenPrices,
  }),
}));

function makeToken(path: string, decimals = 6) {
  return {
    path,
    name: "TestToken",
    symbol: "TT",
    decimals,
    logoURI: "",
    priceID: path,
    chainId: "test",
    createdAt: "",
    address: "",
    wrappedPath: path,
    type: 0,
    isGnot: false,
  } as never;
}

describe("useTokenAmountInput — balance derivation", () => {
  beforeEach(() => {
    for (const k of Object.keys(mockDisplayBalanceMap)) {
      delete mockDisplayBalanceMap[k];
    }
    for (const k of Object.keys(mockTokenPrices)) {
      delete mockTokenPrices[k];
    }
  });

  it("returns '0' when token is null", () => {
    const { result } = renderHook(() => useTokenAmountInput(null), { wrapper });
    expect(result.current.balance).toBe("0");
  });

  it("returns '0' when token.path is not in displayBalanceMap", () => {
    const token = makeToken("gno.land/r/demo/foo");
    const { result } = renderHook(() => useTokenAmountInput(token), { wrapper });
    expect(result.current.balance).toBe("0");
  });

  it("returns formatted balance when token.path exists in displayBalanceMap", () => {
    const token = makeToken("gno.land/r/demo/foo");
    mockDisplayBalanceMap["gno.land/r/demo/foo"] = "123456.789";

    const { result } = renderHook(() => useTokenAmountInput(token), { wrapper });
    expect(result.current.balance).toBe("123,456.789");
  });

  it("returns '0' for amount initially and allows changing", () => {
    const token = makeToken("gno.land/r/demo/foo");
    const { result } = renderHook(() => useTokenAmountInput(token), { wrapper });

    expect(result.current.amount).toBe("0");

    act(() => {
      result.current.changeAmount("100");
    });

    expect(result.current.amount).toBe("100");
  });
});
