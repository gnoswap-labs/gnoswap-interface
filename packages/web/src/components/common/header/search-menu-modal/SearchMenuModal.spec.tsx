import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { swapExtensions } from "@resources/swap-extension";
import { DEVICE_TYPE } from "@styles/media";

import SearchMenuModal, { Token } from "./SearchMenuModal";

const mockGetGnoscanUrl = jest.fn(() => "https://gnoscan.io/");
const mockGetRealmUrl = jest.fn((path: string) => `https://gnoscan.io/realms/details?path=${path}`);
const mockGetTokenUrl = jest.fn((path: string) => `https://gnoscan.io/tokens/${path}`);

jest.mock("@hooks/common/use-gnoscan-url", () => ({
  useGnoscanUrl: () => ({
    getGnoscanUrl: mockGetGnoscanUrl,
    getRealmUrl: mockGetRealmUrl,
    getTokenUrl: mockGetTokenUrl,
  }),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("SearchMenuModal Component", () => {
  const extension = swapExtensions[0];
  const originToken: Token = {
    path: extension.originTokenPath,
    searchType: "TOKEN",
    token: {
      path: extension.originTokenPath,
      name: "Bubble",
      symbol: extension.originTokenInfo.symbol,
      displaySymbol: extension.originTokenInfo.symbol,
      logoURI: "",
    },
    price: "$0.189",
    priceOf1d: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "Today",
    },
    fee: "",
    liquidity: 0,
    isNative: true,
    isLiquid: false,
    priceGradeType: TOKEN_PRICE_GRADE_TYPE.NONE,
  };
  const mockProps = {
    onSearchMenuToggle: jest.fn(),
    search: jest.fn(),
    moveTokenPage: jest.fn(),
    movePoolPage: jest.fn(),
    keyword: "",
    isFetched: true,
    placeholder: "Search",
    tokens: [originToken],
    breakpoint: DEVICE_TYPE.WEB,
    mostLiquidity: [],
    popularTokens: [originToken],
    recents: [],
  };

  const renderSearchMenu = () =>
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SearchMenuModal {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

  it("renders", () => {
    renderSearchMenu();
  });

  it("shows and opens the Bubble origin realm path", () => {
    const open = jest.spyOn(window, "open").mockImplementation();
    const { container } = renderSearchMenu();
    expect(container.querySelector(".token-name")).toHaveTextContent("BUBBLE");

    expect(screen.getByText(extension.originTokenPath.replace(/^gno\.land\//, ""))).toBeInTheDocument();
    fireEvent.click(container.querySelector(".token-path")!);

    expect(mockGetRealmUrl).toHaveBeenCalledWith(extension.originTokenPath);
    expect(open).toHaveBeenCalledWith(
      `https://gnoscan.io/realms/details?path=${extension.originTokenPath}`,
      "_blank",
    );
  });
});
