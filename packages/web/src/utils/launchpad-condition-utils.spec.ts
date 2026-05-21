import { XGNS_TOKEN } from "@common/values/token-constant";
import { LaunchpadProjectConditionModel } from "@models/launchpad";
import { TokenModel } from "@models/token/token-model";

import {
  formatLaunchpadConditionAmount,
  getLaunchpadConditionDisplayAmount,
  getLaunchpadConditionSymbol,
  getLaunchpadConditionToken,
} from "./launchpad-condition-utils";

const fooToken: TokenModel = {
  path: "gno.land/r/gnoswap/test_token/foo",
  tokenId: "gno.land/r/gnoswap/test_token/foo.FOO",
  type: "GRC20",
  chainId: "dev.gnoswap",
  name: "Foo Token",
  symbol: "FOO",
  displaySymbol: "FOO",
  decimals: 6,
  logoURI: "",
  createdAt: "2026-05-13T00:00:00Z",
  priceID: "gno.land/r/gnoswap/test_token/foo",
};

const condition: LaunchpadProjectConditionModel = {
  tokenPath: fooToken.path,
  leastTokenAmount: 1000000,
};

describe("launchpad condition utils", () => {
  it("converts raw condition amounts using token decimals", () => {
    expect(getLaunchpadConditionDisplayAmount(condition, [fooToken]).toString()).toBe("1");
    expect(formatLaunchpadConditionAmount(condition, [fooToken])).toBe("1");
  });

  it("uses xGNS decimals for xGNS conditions", () => {
    const xGnsCondition: LaunchpadProjectConditionModel = {
      tokenPath: XGNS_TOKEN.path,
      leastTokenAmount: 2500000,
    };

    expect(getLaunchpadConditionToken(xGnsCondition, [])).toEqual(XGNS_TOKEN);
    expect(getLaunchpadConditionDisplayAmount(xGnsCondition, []).toString()).toBe("2.5");
    expect(getLaunchpadConditionSymbol(xGnsCondition, [])).toBe("xGNS");
  });

  it("falls back to raw amount and path suffix when token metadata is missing", () => {
    expect(getLaunchpadConditionDisplayAmount(condition, []).toString()).toBe("1000000");
    expect(getLaunchpadConditionSymbol(condition, [])).toBe("FOO");
  });
});
