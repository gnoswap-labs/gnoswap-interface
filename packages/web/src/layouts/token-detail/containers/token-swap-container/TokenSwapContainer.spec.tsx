import { render } from "@testing-library/react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { useSwapHandler } from "@hooks/swap/data/use-swap-handler";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import { useGetToken } from "@query/token";

import TokenSwapContainer from "./TokenSwapContainer";

jest.mock("jotai", () => ({ useAtomValue: () => "light" }));
jest.mock("@states/index", () => ({ ThemeState: { themeKey: {} } }));
jest.mock("@hooks/common/use-custom-router", () => ({ __esModule: true, default: jest.fn() }));
jest.mock("@hooks/swap/data/use-swap-handler", () => ({ useSwapHandler: jest.fn() }));
jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({ useGnotToGnot: jest.fn() }));
jest.mock("@query/token", () => ({ useGetToken: jest.fn() }));
jest.mock("@components/common/setting-menu-modal/SettingMenuModal", () => () => null);
jest.mock("../../components/token-swap/TokenSwap", () => () => null);

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
