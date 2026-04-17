import { Provider as JotaiProvider, createStore } from "jotai";
import { render, screen } from "@testing-library/react";

import { SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { SwapState } from "@states/index";
import { SwapConfirmModalState } from "@states/swap";
import ConfirmSwapModal from "./ConfirmSwapModal";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const swapSummaryInfo: SwapSummaryInfo = {
  tokenA: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
  },
  tokenB: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Bar",
    path: "gno.land/r/bar",
    decimals: 4,
    symbol: "BAR",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
    priceID: "gno.land/r/bar",
    address: "",
  },
  swapDirection: "EXACT_IN",
  swapRate: 1.14,
  swapRateUSD: 1.14,
  priceImpact: 0.3,
  guaranteedAmount: {
    amount: 45124,
    currency: "BAR",
  },
  gasFee: {
    amount: 0.000001,
    currency: "GNOT",
  },
  gasFeeUSD: 0.1,
  swapRate1USD: 0,
  swapRateAction: SwapRateAction.ATOB,
  protocolFee: "0.30%",
  routerFee: 0.15,
  gasEstimateSuccess: true,
};

const swapTokenInfo: SwapTokenInfo = {
  tokenA: {
    chainId: "dev",
    createdAt: "2023-10-17T05:58:00+09:00",
    name: "Foo",
    address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    type: "GRC20",
    priceID: "gno.land/r/foo",
  },
  tokenAAmount: "10",
  tokenABalance: "100",
  tokenAUSD: 10,
  tokenAUSDStr: "$10.00",
  tokenB: {
    chainId: "dev",
    createdAt: "2023-10-17T05:58:00+09:00",
    name: "Bar",
    address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg470",
    path: "gno.land/r/bar",
    decimals: 4,
    symbol: "BAR",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
    type: "GRC20",
    priceID: "gno.land/r/bar",
  },
  tokenBAmount: "11.4",
  tokenBBalance: "200",
  tokenBUSD: 11.4,
  tokenBUSDStr: "$11.40",
  direction: "EXACT_IN",
  slippage: 0.5,
  tokenAPriceGrade: "NONE",
  tokenBPriceGrade: "NONE",
};

const defaultProps = {
  submitted: false,
  swapResult: null,
  title: "Confirm swap",
  isWrapOrUnwrap: false,
  priceImpactStatus: "HIGH" as const,
  isLoading: false,
  connectedWallet: true,
  setSwapRateAction: jest.fn(),
  swap: jest.fn(),
  close: jest.fn(),
};

describe("ConfirmSwapModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderModal(state: SwapConfirmModalState) {
    const store = createStore();
    store.set(SwapState.swapConfirmModalState, state);

    return render(
      <JotaiProvider store={store}>
        <GnoswapThemeProvider>
          <ConfirmSwapModal {...defaultProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  }

  it("does not render when confirm modal state is idle", () => {
    const { container } = renderModal({ status: "idle" });

    expect(container.firstChild).toBeNull();
    expect(screen.queryByText("Confirm swap")).not.toBeInTheDocument();
  });

  it("renders swap data when confirm modal state is ready", () => {
    renderModal({
      status: "ready",
      swapTokenInfo,
      swapSummaryInfo,
      isRefetching: false,
      estimatedAmount: null,
      tokenAmountLimit: 45124,
    });

    expect(screen.getAllByText("Confirm swap")).toHaveLength(2);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("11.4")).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(screen.getByText("$11.40")).toBeInTheDocument();
  });
});
