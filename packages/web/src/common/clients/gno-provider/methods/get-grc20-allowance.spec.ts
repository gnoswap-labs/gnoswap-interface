import type { GnoProvider } from "@gnolang/gno-js-client";

import { PACKAGE_COMMON_PATH } from "@constants/environment.constant";

import { getGRC20Allowance } from "./get-grc20-allowance";

describe("getGRC20Allowance", () => {
  it.each([
    [
      "gno.land/r/gnoland/wugnot.wugnot",
      "Allowance(\"gno.land/r/gnoland/wugnot.wugnot\", \"owner\", \"spender\")",
    ],
    [
      "gno.land/r/gnoswap/gns.GNS",
      "Allowance(\"gno.land/r/gnoswap/gns.GNS\", \"owner\", \"spender\")",
    ],
  ])("reads the allowance for %s through the common realm", async (tokenKey, allowanceExpression) => {
    const evaluateExpression = jest.fn(async (path: string, expression: string) =>
      path === PACKAGE_COMMON_PATH && expression === allowanceExpression ? "(42 int64)" : "",
    );
    const provider = { evaluateExpression } as unknown as GnoProvider;

    await expect(getGRC20Allowance(provider, tokenKey, "owner", "spender")).resolves.toBe(42);
  });
});
