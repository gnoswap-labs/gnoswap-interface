import { PriceImpactStatus, SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import SwapCardContent from "./SwapCardContent";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const swapTokenInfo: SwapTokenInfo = {
  tokenA: {
    token: {
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
    amount: "",
    balance: "",
    usd: 0,
    usdStr: "0",
    priceGrade: "NONE",
    decimals: 4,
  },
  tokenB: {
    token: {
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
    amount: "",
    balance: "",
    usd: 0,
    usdStr: "0",
    priceGrade: "NONE",
    decimals: 4,
  },
  direction: "EXACT_IN",
  slippage: 10,
};

describe("SwapCardContent Component", () => {
  it.each([
    [swapTokenInfo.tokenA, swapTokenInfo.tokenB],
    [null, swapTokenInfo.tokenB],
    [swapTokenInfo.tokenA, null],
    [null, null],
  ])("renders selected and absent token sides (%#)", (tokenA, tokenB) => {
    const mockProps = {
      swapTokenInfo: { ...swapTokenInfo, tokenA, tokenB },
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
      isLoadingGasInfo: false,
      isRefetching: false,
    };

    const { getAllByRole, container } = render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardContent {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
    expect(getAllByRole("textbox")).toHaveLength(2);
    expect(getAllByRole("textbox")[0]).toHaveValue(tokenA?.amount ?? "");
    expect(getAllByRole("textbox")[1]).toHaveValue(tokenB?.amount ?? "");
    if (!tokenA) {
      expect(container.querySelector(".balance-max-button")).not.toBeInTheDocument();
    }
  });
});
