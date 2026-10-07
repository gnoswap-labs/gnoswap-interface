import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import { TooltipInfo } from "../PoolGraph.types";
import PoolGraphTooltip from "./PoolGraphTooltip";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const tokenA = {
  path: "gno.land/r/demo/usdc",
  type: "GRC20" as const,
  chainId: "test-chain",
  name: "USDC",
  symbol: "USDC",
  displaySymbol: "USDC",
  decimals: 6,
  logoURI: "",
  createdAt: "",
  priceID: "USDC",
};

const tokenB = {
  path: "gno.land/r/demo/gnot",
  type: "GRC20" as const,
  chainId: "test-chain",
  name: "GNOT",
  symbol: "GNOT",
  displaySymbol: "GNOT",
  decimals: 18,
  logoURI: "",
  createdAt: "",
  priceID: "GNOT",
};

const baseTooltipInfo: TooltipInfo = {
  tokenA,
  tokenB,
  tokenAAmount: "12.3456",
  tokenBAmount: "0",
  tokenAUsd: "$24.69",
  tokenBUsd: "$0",
  positionTokenAAmount: "3.0864",
  positionTokenBAmount: "0",
  positionTokenAUsd: "$6.17",
  positionTokenBUsd: "$0",
  tokenAVisible: true,
  tokenBVisible: false,
  positionTokenAVisible: true,
  positionTokenBVisible: false,
  isPositionActive: true,
  positionLiquidityShare: "25%",
  price: "1.005",
};

const renderTooltip = (tooltipInfo: TooltipInfo, isPosition: boolean) =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <PoolGraphTooltip tooltipInfo={tooltipInfo} isPosition={isPosition} />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

describe("PoolGraphTooltip", () => {
  it("renders only price and total liquidity sections for hovered pool bins", () => {
    renderTooltip(baseTooltipInfo, false);

    expect(screen.getByText("1.005 GNOT")).toBeInTheDocument();
    expect(screen.queryByText("Total liquidity")).not.toBeInTheDocument();
    expect(screen.queryByText("Your liquidity")).not.toBeInTheDocument();
    expect(screen.queryByText("Share")).not.toBeInTheDocument();
    expect(screen.getByText("12.3456")).toBeInTheDocument();
    expect(screen.getByText("($24.69)")).toBeInTheDocument();
    expect(screen.queryByText("GNOT", { selector: ".symbol" })).not.toBeInTheDocument();
  });

  it("uses the clarified Price label instead of pinning the tooltip to Current Price", () => {
    renderTooltip(baseTooltipInfo, false);

    expect(screen.getByText("common:price:")).toBeInTheDocument();
    expect(screen.queryByText("business:currentPrice")).not.toBeInTheDocument();
  });

  it("formats tiny decimal prices with the Add Position subscript style", () => {
    renderTooltip(
      {
        ...baseTooltipInfo,
        price: "0.000000123456",
      },
      false,
    );

    expect(screen.getByText("0.0₆12345 GNOT")).toBeInTheDocument();
    expect(screen.queryByText("0.000000123456 GNOT")).not.toBeInTheDocument();
  });

  it("renders total liquidity and user liquidity with ownership share in position mode", () => {
    renderTooltip(
      {
        ...baseTooltipInfo,
        tokenBAmount: "8.7654",
        tokenBUsd: "$17.53",
        positionTokenBAmount: "2.1913",
        positionTokenBUsd: "$4.38",
        tokenBVisible: true,
        positionTokenBVisible: true,
      },
      true,
    );

    expect(screen.getByText("Total liquidity")).toBeInTheDocument();
    expect(screen.getByText("Your liquidity (25%)")).toBeInTheDocument();
    expect(screen.queryByText("Your liquidity")).not.toBeInTheDocument();
    expect(screen.queryByText("Share")).not.toBeInTheDocument();
    expect(screen.getByText("3.0864")).toBeInTheDocument();
    expect(screen.getByText("($6.17)")).toBeInTheDocument();
    expect(screen.getByText("2.1913")).toBeInTheDocument();
    expect(screen.getByText("($4.38)")).toBeInTheDocument();
    expect(screen.queryByText("25%")).not.toBeInTheDocument();
  });

  it("hides user liquidity when the user has no liquidity in the hovered position bin", () => {
    renderTooltip(
      {
        ...baseTooltipInfo,
        positionTokenAAmount: "0",
        positionTokenAUsd: "$0",
        isPositionActive: false,
        positionLiquidityShare: "0%",
      },
      true,
    );

    expect(screen.getByText("Total liquidity")).toBeInTheDocument();
    expect(screen.getByText("12.3456")).toBeInTheDocument();
    expect(screen.queryByText(/Your liquidity/)).not.toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    expect(screen.queryByText("($0)")).not.toBeInTheDocument();
    expect(screen.queryByText("0%")).not.toBeInTheDocument();
  });

  it("formats tiny decimal token amounts with the Add Position subscript style", () => {
    renderTooltip(
      {
        ...baseTooltipInfo,
        tokenAAmount: "0.000000123456",
        positionTokenAAmount: "0.000000123456",
      },
      true,
    );

    expect(screen.getAllByText("0.0\u208612345")).toHaveLength(2);
  });

  it("keeps user liquidity visible for compact less-than amounts", () => {
    renderTooltip(
      {
        ...baseTooltipInfo,
        positionTokenAAmount: "<0.000001",
        positionLiquidityShare: "0.01%",
      },
      true,
    );

    expect(screen.getByText("Your liquidity (0.01%)")).toBeInTheDocument();
    expect(screen.getByText("<0.000001")).toBeInTheDocument();
  });

  it("keeps user liquidity visible when the hovered bin is in the position range", () => {
    renderTooltip(
      {
        ...baseTooltipInfo,
        positionTokenAAmount: "0",
        positionTokenAUsd: "$0",
        isPositionActive: true,
      },
      true,
    );

    expect(screen.getByText("Your liquidity (25%)")).toBeInTheDocument();
  });
});
