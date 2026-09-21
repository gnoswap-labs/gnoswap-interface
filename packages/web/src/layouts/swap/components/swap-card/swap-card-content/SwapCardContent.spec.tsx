import { PriceImpactStatus, SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import SwapCardContent from "./SwapCardContent";

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ transactionGasService: null }),
  useOptionalGnoswapContext: () => null,
}));

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const swapTokenInfo: SwapTokenInfo = {
  tokenA: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    displaySymbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
  },
  tokenAAmount: "",
  tokenABalance: "",
  tokenAUSD: 0,
  tokenAUSDStr: "0",
  tokenAPriceGrade: "NONE",
  tokenBPriceGrade: "NONE",
  tokenB: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    displaySymbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
  },
  tokenBAmount: "",
  tokenBBalance: "",
  tokenBUSD: 0,
  tokenBUSDStr: "0",
  direction: "EXACT_IN",
  slippage: 10,
};

// On-chain USDC balance (raw 62667447936264477, 6 decimals) that exceeds Number.MAX_SAFE_INTEGER
const LARGE_BALANCE = "62667447936.264477";

describe("SwapCardContent Component", () => {
  it("Max forwards the exact balance string without number rounding", async () => {
    const changeTokenAAmount = jest.fn();
    const mockProps = {
      swapTokenInfo: {
        ...swapTokenInfo,
        tokenA: { ...swapTokenInfo.tokenA!, decimals: 6 },
        tokenABalance: LARGE_BALANCE,
      },
      swapSummaryInfo: null,
      swapRouteInfos: [],
      changeTokenA: () => null,
      changeTokenAAmount,
      changeTokenB: () => null,
      changeTokenBAmount: () => null,
      switchSwapDirection: () => null,
      connectedWallet: true,
      isLoading: false,
      setSwapRateAction: () => null,
      isSwitchNetwork: false,
      priceImpactStatus: "NONE" as PriceImpactStatus,
      isSameToken: false,
      resetEstimatedLiquidity: (): void => {},
      isRefetching: false,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardContent {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    fireEvent.click(screen.getByText("common:max"));

    await waitFor(() => expect(changeTokenAAmount).toHaveBeenCalledWith(LARGE_BALANCE));
    expect(parseFloat(LARGE_BALANCE).toString()).not.toBe(LARGE_BALANCE);
  });

  it("SwapCardContent render", () => {
    const mockProps = {
      swapTokenInfo,
      swapSummaryInfo: null,
      swapRouteInfos: [],
      changeTokenA: () => null,
      changeTokenAAmount: () => null,
      changeTokenB: () => null,
      changeTokenBAmount: () => null,
      switchSwapDirection: () => null,
      connectedWallet: false,
      isLoading: false,
      setSwapRateAction: (type: SwapRateAction) => {
        console.log(type);
      },
      isSwitchNetwork: false,
      priceImpactStatus: "NONE" as PriceImpactStatus,
      isSameToken: false,
      resetEstimatedLiquidity: (): void => {},
      isRefetching: false,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardContent {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
