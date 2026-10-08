import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import TokenChart, { type TokenInfo } from "./TokenChart";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({ "common:noData": "No data", "TokenDetails:chart.loading": "Loading price candles…" })[key] || key,
  }),
}));
jest.mock("./token-chart-info/TokenChartInfo", () => ({ __esModule: true, default: () => null }));
jest.mock(
  "next/dynamic",
  () => () =>
    function OracleHistory() {
      return (
        <section aria-label="Oracle price history">
          <button>Search older history</button>
        </section>
      );
    },
);

const tokenInfo: TokenInfo = {
  token: {
    name: "GNS",
    symbol: "GNS",
    displaySymbol: "GNS",
    image: "",
    pkg_path: "gno.land/r/demo/gns",
    decimals: 6,
    description: "",
    website_url: "",
  },
  priceInfo: {
    amount: { value: 1, denom: "USD", status: MATH_NEGATIVE_TYPE.NONE },
    priceGradeType: "ORACLE",
    changedRate: "0%",
  },
};
const view = (priceGradeType: TokenInfo["priceInfo"]["priceGradeType"], loading = false) => (
  <JotaiProvider>
    <GnoswapThemeProvider>
      <TokenChart
        tokenInfo={{ ...tokenInfo, priceInfo: { ...tokenInfo.priceInfo, priceGradeType } }}
        loading={loading}
        candlePath="gno.land/r/demo/gns"
      />
    </GnoswapThemeProvider>
  </JotaiProvider>
);

it.each(["NONE", "INFORMATIONAL"] as const)(
  "shows the existing empty state without history actions for %s prices",
  grade => {
    render(view(grade));
    expect(screen.getByRole("status")).toHaveTextContent("No data");
    expect(screen.queryByRole("button", { name: "Search older history" })).not.toBeInTheDocument();
  },
);

it("switches between the empty state and oracle history when the grade changes", () => {
  const { rerender } = render(view("INFORMATIONAL"));
  rerender(view("ORACLE"));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.getByRole("region", { name: "Oracle price history" })).toBeInTheDocument();
  rerender(view("NONE"));
  expect(screen.getByRole("status")).toHaveTextContent("No data");
  expect(screen.queryByRole("region", { name: "Oracle price history" })).not.toBeInTheDocument();
});

it("does not present an unknown loading grade as a completed no-data result", () => {
  render(view("NONE", true));
  expect(screen.getByRole("status")).toHaveTextContent("Loading price candles…");
  expect(screen.queryByText("No data")).not.toBeInTheDocument();
});
