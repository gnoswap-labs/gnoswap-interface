import { fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider as JotaiProvider } from "jotai";
import React from "react";

import { GNOT_TOKEN, GNS_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { TokenState } from "@states/index";

import SelectTokenContainer from "./SelectTokenContainer";

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: jest.fn(),
}));
jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({ breakpoint: "web", handleBreakpoint: jest.fn() }),
}));
jest.mock("@hooks/common/use-clear-modal", () => ({
  useClearModal: () => jest.fn(),
}));
jest.mock("@hooks/common/use-esc-close-modal", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("@hooks/token/ui/use-token-warning-modal", () => ({
  useTokenWarningModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ isSwitchNetwork: false }),
}));
jest.mock("@hooks/common/use-gnoscan-url", () => ({
  useGnoscanUrl: () => ({ getGnoscanUrl: jest.fn(), getRealmUrl: jest.fn(), getTokenUrl: jest.fn() }),
}));

const makeToken = (symbol: string, isVerified: boolean): TokenModel => ({
  type: "GRC20",
  chainId: "dev",
  createdAt: "",
  name: symbol,
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  decimals: 6,
  symbol,
  displaySymbol: symbol,
  logoURI: "logo.svg",
  priceID: `gno.land/r/demo/${symbol.toLowerCase()}`,
  isVerified,
});

const verifiedToken = makeToken("VER", true);
const unverifiedToken = makeToken("UNV", false);

const mockedUseTokenData = useTokenData as jest.Mock;

const renderContainer = (recents: TokenModel[] = [], store = createStore()) => {
  store.set(TokenState.selectRecents, JSON.stringify(recents));
  const result = render(
    <JotaiProvider store={store}>
      <GnoswapThemeProvider>
        <SelectTokenContainer changeToken={jest.fn()} />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );
  return { store, ...result };
};

const listSymbols = () =>
  Array.from(document.querySelectorAll(".token-list-wrapper .list .token-symbol")).map(el => el.textContent);
const chipSymbols = () => Array.from(document.querySelectorAll(".token-select .token-button")).map(el => el.textContent);
const toggle = () => fireEvent.click(screen.getByRole("checkbox"));
const search = (keyword: string) =>
  fireEvent.change(document.querySelector(".search-input")!, { target: { value: keyword } });

describe("SelectTokenContainer unverified token filtering", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedUseTokenData.mockReturnValue({
      tokens: [verifiedToken, unverifiedToken],
      getTokenUSDPrice: () => null,
      displayBalanceStringMap: {},
    });
  });

  it("hides unverified tokens by default", () => {
    renderContainer();

    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(listSymbols()).toEqual(["VER"]);
  });

  it("shows unverified tokens when the toggle is switched on", () => {
    renderContainer();

    toggle();

    expect(listSymbols()).toEqual(["VER", "UNV"]);
  });

  it("keeps the preference when the modal closes and opens again", () => {
    const { store, unmount } = renderContainer();
    toggle();
    unmount();

    renderContainer([], store);

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(listSymbols()).toEqual(["VER", "UNV"]);
  });

  it("restores the saved preference in a fresh store and persists switching it off", () => {
    const first = renderContainer();
    toggle();
    first.unmount();

    const second = renderContainer();
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(listSymbols()).toEqual(["VER", "UNV"]);
    toggle();
    second.unmount();

    renderContainer();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(listSymbols()).toEqual(["VER"]);
  });

  it("uses the page preference and shares modal changes with the page", () => {
    const store = createStore();
    store.set(TokenState.showUnverifiedTokens, true);
    renderContainer([], store);

    expect(listSymbols()).toEqual(["VER", "UNV"]);
    toggle();

    expect(store.get(TokenState.showUnverifiedTokens)).toBe(false);
    expect(listSymbols()).toEqual(["VER"]);
  });

  it("does not find unverified tokens by search while the toggle is off", () => {
    renderContainer();

    search("UNV");
    expect(listSymbols()).toEqual([]);

    toggle();
    expect(listSymbols()).toEqual(["UNV"]);
  });

  it("hides unverified tokens from the token chips while the toggle is off", () => {
    renderContainer([unverifiedToken]);

    expect(chipSymbols()).not.toContain("UNV");

    toggle();
    expect(chipSymbols()).toContain("UNV");
  });

  it("hides held unverified tokens while the toggle is off", () => {
    mockedUseTokenData.mockReturnValue({
      tokens: [verifiedToken, unverifiedToken],
      getTokenUSDPrice: () => null,
      displayBalanceStringMap: { [unverifiedToken.path]: "100" },
    });
    renderContainer();

    expect(listSymbols()).toEqual(["VER"]);

    toggle();
    expect(listSymbols()).toEqual(["UNV", "VER"]);
  });

  it("keeps hidden unverified recent tokens when selecting a token while the toggle is off", () => {
    const { store } = renderContainer([unverifiedToken]);

    fireEvent.click(document.querySelector(".token-list-wrapper .list")!);

    const storedPaths = JSON.parse(store.get(TokenState.selectRecents)).map((token: TokenModel) => token.path);
    expect(storedPaths).toEqual([verifiedToken.path, unverifiedToken.path]);
  });
});

describe("SelectTokenContainer token chips", () => {
  const gnot = { ...GNOT_TOKEN, isVerified: true };
  const gns = { ...GNS_TOKEN, isVerified: true };
  const wugnot = { ...WUGNOT_TOKEN, isVerified: true };
  const [tokenA, tokenB, tokenC] = ["AAA", "BBB", "CCC"].map(symbol => makeToken(symbol, true));

  beforeEach(() => {
    localStorage.clear();
    mockedUseTokenData.mockReturnValue({
      tokens: [tokenA, tokenB, tokenC, wugnot, gns, gnot, unverifiedToken],
      getTokenUSDPrice: () => null,
      displayBalanceStringMap: {},
    });
  });

  const selectFromList = (symbol: string) =>
    fireEvent.click(
      Array.from(document.querySelectorAll(".token-list-wrapper .list")).find(
        row => row.querySelector(".token-symbol")?.textContent === symbol,
      )!,
    );

  it("shows only GNOT, GNS, wugnot when there are no recent tokens", () => {
    renderContainer();

    expect(chipSymbols()).toEqual(["GNOT", "GNS", "wugnot"]);
  });

  it("puts recent tokens first and pushes the default tokens out of the four slots", () => {
    renderContainer([tokenB, tokenA]);

    expect(chipSymbols()).toEqual(["BBB", "AAA", "GNOT", "GNS"]);
  });

  it("does not let hidden unverified recent tokens take a slot", () => {
    renderContainer([unverifiedToken, tokenA]);

    expect(chipSymbols()).toEqual(["AAA", "GNOT", "GNS", "wugnot"]);
  });

  it("stores the selected token as the most recent one, including GNOT", () => {
    const { store } = renderContainer([tokenA, tokenB, tokenC]);

    selectFromList("GNOT");

    const storedSymbols = JSON.parse(store.get(TokenState.selectRecents)).map((token: TokenModel) => token.symbol);
    expect(storedSymbols).toEqual(["GNOT", "AAA", "BBB", "CCC"]);
  });

  it("moves a selected recent token to the front and keeps at most four", () => {
    const { store } = renderContainer([tokenA, tokenB, tokenC, gns]);

    selectFromList("CCC");
    selectFromList("wugnot");

    const storedSymbols = JSON.parse(store.get(TokenState.selectRecents)).map((token: TokenModel) => token.symbol);
    expect(storedSymbols).toEqual(["wugnot", "CCC", "AAA", "BBB"]);
  });
});
