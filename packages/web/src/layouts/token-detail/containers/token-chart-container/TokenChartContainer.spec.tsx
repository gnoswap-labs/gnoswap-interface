import { render, screen } from "@testing-library/react";
import { Provider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import TokenChartContainer from "./TokenChartContainer";

const mockToken = {
  name: "GNS",
  symbol: "GNS",
  displaySymbol: "GNS",
  logoURI: "gns.svg",
  path: "gno.land/r/demo/gns",
  decimals: 6,
};
let mockTokenLoading = true;
let mockPriceLoading = true;
let mockPrice = "";
const mockRouter = { getTokenPath: () => mockToken.path, push: jest.fn() };
jest.mock("@hooks/common/use-custom-router", () => ({ __esModule: true, default: () => mockRouter }));
jest.mock("@hooks/common/use-clear-modal", () => ({ useClearModal: () => jest.fn() }));
jest.mock("@hooks/common/use-loading", () => ({ useLoading: () => ({ isLoading: false }) }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({ useGnoswapContext: () => ({ gnoswapApiClient: {} }) }));
jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ wugnotPath: "wugnot", getGnotPath: (token: unknown) => token }),
}));
jest.mock("@hooks/token/ui/use-token-warning-modal", () => ({
  useTokenWarningModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@query/token", () => ({
  useGetToken: () => ({ data: mockTokenLoading ? undefined : mockToken, isLoading: mockTokenLoading }),
  useGetTokenPrices: () => ({
    data: mockPriceLoading ? undefined : { usd: mockPrice, priceGradeType: "INFORMATIONAL" },
    isLoading: mockPriceLoading,
  }),
}));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("../../components/token-chart/token-chart-info/TokenChartInfo", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock(
  "next/dynamic",
  () => () =>
    function History() {
      return <section aria-label="Token candles" />;
    },
);

beforeEach(() => {
  mockTokenLoading = true;
  mockPriceLoading = true;
  mockPrice = "";
});
const view = () => (
  <Provider>
    <GnoswapThemeProvider>
      <TokenChartContainer />
    </GnoswapThemeProvider>
  </Provider>
);

it.each(["0", "1.5"])("waits for the separate price query before deciding whether %s has chart data", price => {
  const { rerender } = render(view());
  expect(screen.getByRole("status")).toHaveAttribute("aria-label", "TokenDetails:chart.loading");
  mockTokenLoading = false;
  rerender(view());
  expect(screen.getByRole("status")).toHaveAttribute("aria-label", "TokenDetails:chart.loading");
  expect(screen.queryByText("common:noData")).not.toBeInTheDocument();
  mockPrice = price;
  mockPriceLoading = false;
  rerender(view());
  if (price === "0") {
    expect(screen.getByRole("status")).toHaveTextContent("common:noData");
    expect(screen.queryByRole("region", { name: "Token candles" })).not.toBeInTheDocument();
  } else {
    expect(screen.getByRole("region", { name: "Token candles" })).toBeInTheDocument();
    expect(screen.queryByText("common:noData")).not.toBeInTheDocument();
  }
});
