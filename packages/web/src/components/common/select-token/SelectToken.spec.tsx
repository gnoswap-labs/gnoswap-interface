import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import React from "react";

import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { swapExtensions } from "@resources/swap-extension";
import { DEVICE_TYPE } from "@styles/media";

import SelectToken, { SelectTokenProps } from "./SelectToken";

const mockGetGnoscanUrl = jest.fn(() => "https://gnoscan.io/");
const mockGetRealmUrl = jest.fn((path: string) => `https://gnoscan.io/realms/details?path=${path}`);
const mockGetTokenUrl = jest.fn((path: string) => `https://gnoscan.io/tokens/${path}`);

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));
jest.mock("@hooks/common/use-gnoscan-url", () => ({
  useGnoscanUrl: () => ({
    getGnoscanUrl: mockGetGnoscanUrl,
    getRealmUrl: mockGetRealmUrl,
    getTokenUrl: mockGetTokenUrl,
  }),
}));

describe("SelectToken Component", () => {
  const extension = swapExtensions[0];
  const token: TokenModel = {
    type: "Native",
    chainId: "portal-loop",
    createdAt: "",
    name: "Bubble",
    path: extension.originTokenPath,
    decimals: 6,
    symbol: "BUBBLE",
    displaySymbol: "BUBBLE",
    logoURI: "",
    priceID: extension.grc20WrappedTokenPath,
  };
  const args: SelectTokenProps = {
    keyword: "",
    defaultTokens: [],
    tokens: [token],
    tokenPrices: {},
    changeKeyword: jest.fn(),
    changeToken: jest.fn(),
    close: jest.fn(),
    themeKey: "dark",
    breakpoint: DEVICE_TYPE.WEB,
    recents: [],
    isSwitchNetwork: false,
  };

  const renderSelectToken = () =>
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SelectToken {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

  it("renders", () => {
    renderSelectToken();
  });

  it("shows an origin realm path instead of the native coin label", () => {
    renderSelectToken();

    expect(screen.getByText(extension.originTokenPath.replace(/^gno\.land\//, ""))).toBeInTheDocument();
    expect(screen.queryByText("Native Coin")).not.toBeInTheDocument();
  });

  it("opens an origin realm in Gnoscan", () => {
    const open = jest.spyOn(window, "open").mockImplementation();
    const { container } = renderSelectToken();

    fireEvent.click(container.querySelector(".token-path")!);

    expect(mockGetRealmUrl).toHaveBeenCalledWith(extension.originTokenPath);
    expect(open).toHaveBeenCalledWith(
      `https://gnoscan.io/realms/details?path=${extension.originTokenPath}`,
      "_blank",
    );
  });
});
