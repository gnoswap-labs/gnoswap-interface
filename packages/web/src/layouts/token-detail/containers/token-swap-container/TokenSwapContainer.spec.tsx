import { render } from "@testing-library/react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { useSwapHandler } from "@hooks/swap/data/use-swap-handler";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import { useGetToken } from "@query/token";

import TokenSwapContainer from "./TokenSwapContainer";

let mockSwapExtensionTokens: TokenModel[] = [];
const mockTokenSwap = jest.fn(() => null);

jest.mock("jotai", () => ({ useAtomValue: () => "light" }));
jest.mock("@states/index", () => ({ ThemeState: { themeKey: {} } }));
jest.mock("@hooks/common/use-custom-router", () => ({ __esModule: true, default: jest.fn() }));
jest.mock("@hooks/swap/data/use-swap-handler", () => ({ useSwapHandler: jest.fn() }));
jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({ useGnotToGnot: jest.fn() }));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({ swapExtensionTokens: mockSwapExtensionTokens }),
}));
jest.mock("@query/token", () => ({ useGetToken: jest.fn() }));
jest.mock("@components/common/setting-menu-modal/SettingMenuModal", () => () => null);
jest.mock("../../components/token-swap/TokenSwap", () => (props: unknown) => mockTokenSwap(props));

const native = {
  path: "ugnot",
  wrappedPath: "gno.land/r/gnoland/wugnot",
  type: "Native",
  symbol: "GNOT",
  displaySymbol: "GNOT",
} as TokenModel;
const wrapped = {
  path: native.wrappedPath,
  type: "GRC20",
  symbol: "WUGNOT",
  displaySymbol: "WUGNOT",
} as TokenModel;
const wrappedBubble = {
  ...wrapped,
  path: "gno.land/r/g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr/wbubble.BUBBLE",
  symbol: "BUBBLE",
  displaySymbol: "wBUBBLE",
} as TokenModel;
const originBubble = {
  ...wrappedBubble,
  name: "BUBBLE",
  path: "gno.land/r/g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr/bubble",
  displaySymbol: "BUBBLE",
} as TokenModel;

beforeEach(() => {
  mockSwapExtensionTokens = [];
  mockTokenSwap.mockClear();
});

it.each([
  ["wrap", native, wrapped],
  ["unwrap", wrapped, native],
])("keeps distinct GNOT and WUGNOT identities for %s on the token page", (_action, from, to) => {
  let swapValue = { tokenA: null as TokenModel | null, tokenB: null as TokenModel | null, type: "EXACT_IN" };
  const setSwapValue = jest.fn(updater => {
    swapValue = typeof updater === "function" ? updater(swapValue) : updater;
  });

  (useCustomRouter as jest.Mock).mockReturnValue({
    query: { tokenA: from.path, path: to.path },
    getTokenPath: () => to.path,
    getParameter: () => from.path,
  });
  (useGetToken as jest.Mock).mockImplementation((path: string) => ({
    data: path === native.path ? native : path === wrapped.path ? wrapped : undefined,
  }));
  (useGnotToGnot as jest.Mock).mockReturnValue({
    getGnotPath: (token: TokenModel) => (token.path === wrapped.path ? { ...native } : token),
  });
  (useSwapHandler as jest.Mock).mockReturnValue({
    setSwapValue,
    setTokenAAmount: jest.fn(),
    initializeSwapTokenInputAmount: jest.fn(),
    swapValue,
  });

  render(<TokenSwapContainer />);

  expect(swapValue.tokenA?.path).toBe(from.path);
  expect(swapValue.tokenB?.path).toBe(to.path);
  expect(swapValue.tokenA?.path).not.toBe(swapValue.tokenB?.path);
});

it("keeps a lower origin selection in the lower slot after token-page navigation", () => {
  let routePath = native.path;
  let routeTokenAPath: string | null = wrappedBubble.path;
  let swapValue = {
    tokenA: wrappedBubble as TokenModel | null,
    tokenB: native as TokenModel | null,
    type: "EXACT_IN",
  };
  const setSwapValue = jest.fn(updater => {
    swapValue = typeof updater === "function" ? updater(swapValue) : updater;
  });
  const changeTokenB = jest.fn((token: TokenModel) => {
    swapValue = { ...swapValue, tokenB: token };
  });
  const movePage = jest.fn((_page, params: { path: string; tokenA?: string }) => {
    routePath = params.path;
    routeTokenAPath = params.tokenA ?? null;
  });
  mockSwapExtensionTokens = [originBubble];
  (useCustomRouter as jest.Mock).mockImplementation(() => ({
    query: { path: routePath, tokenA: routeTokenAPath },
    getTokenPath: () => routePath,
    getParameter: () => routeTokenAPath,
    movePage,
  }));
  (useGetToken as jest.Mock).mockImplementation((path: string) => ({
    data: [native, wrappedBubble].find(token => token.path === path),
  }));
  (useGnotToGnot as jest.Mock).mockReturnValue({
    getGnotPath: (token: TokenModel) => token,
  });
  (useSwapHandler as jest.Mock).mockImplementation(() => ({
    setSwapValue,
    setTokenAAmount: jest.fn(),
    initializeSwapTokenInputAmount: jest.fn(),
    changeTokenB,
    swapTokenInfo: { tokenA: swapValue.tokenA, tokenB: swapValue.tokenB },
    swapValue,
  }));
  const { unmount } = render(<TokenSwapContainer />);
  const tokenSwapProps = mockTokenSwap.mock.calls.at(-1)?.[0] as {
    changeTokenB: (token: TokenModel) => void;
  };

  tokenSwapProps.changeTokenB(originBubble);
  unmount();
  swapValue = {
    tokenA: null,
    tokenB: null,
    type: "EXACT_IN",
  };
  render(<TokenSwapContainer />);

  expect(movePage).toHaveBeenCalledWith("TOKEN", {
    path: wrappedBubble.path,
    tokenA: wrappedBubble.path,
  });
  expect(swapValue.tokenA).toBe(wrappedBubble);
  expect(swapValue.tokenB).toBe(originBubble);
});

it("routes a selected origin token through its wrapper when the counter token changes", () => {
  let routePath = native.path;
  let routeTokenAPath: string | null = null;
  let swapValue = {
    tokenA: originBubble as TokenModel | null,
    tokenB: native as TokenModel | null,
    type: "EXACT_IN",
  };
  const setSwapValue = jest.fn(updater => {
    swapValue = typeof updater === "function" ? updater(swapValue) : updater;
  });
  const changeTokenB = jest.fn((token: TokenModel) => {
    swapValue = { ...swapValue, tokenA: wrappedBubble, tokenB: token };
  });
  const movePage = jest.fn((_page, params: { path: string; tokenA?: string }) => {
    routePath = params.path;
    routeTokenAPath = params.tokenA ?? null;
  });
  mockSwapExtensionTokens = [originBubble];
  (useCustomRouter as jest.Mock).mockImplementation(() => ({
    query: { path: routePath, tokenA: routeTokenAPath },
    getTokenPath: () => routePath,
    getParameter: () => routeTokenAPath,
    movePage,
  }));
  (useGetToken as jest.Mock).mockImplementation((path: string) => ({
    data: [native, wrapped, wrappedBubble].find(token => token.path === path),
  }));
  (useGnotToGnot as jest.Mock).mockReturnValue({
    getGnotPath: (token: TokenModel) => token,
  });
  (useSwapHandler as jest.Mock).mockImplementation(() => ({
    setSwapValue,
    setTokenAAmount: jest.fn(),
    initializeSwapTokenInputAmount: jest.fn(),
    changeTokenB,
    swapTokenInfo: { tokenA: swapValue.tokenA, tokenB: swapValue.tokenB },
    swapValue,
  }));
  const { unmount } = render(<TokenSwapContainer />);
  const tokenSwapProps = mockTokenSwap.mock.calls.at(-1)?.[0] as {
    changeTokenB: (token: TokenModel) => void;
  };

  tokenSwapProps.changeTokenB(wrapped);
  unmount();
  swapValue = {
    tokenA: null,
    tokenB: null,
    type: "EXACT_IN",
  };
  render(<TokenSwapContainer />);

  expect(movePage).toHaveBeenCalledWith("TOKEN", {
    path: wrapped.path,
    tokenA: wrappedBubble.path,
  });
  expect(swapValue.tokenA).toBe(wrappedBubble);
  expect(swapValue.tokenB).toBe(wrapped);
});
