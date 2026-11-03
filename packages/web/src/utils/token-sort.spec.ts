import { GNOT_TOKEN, GNS_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";

import { SelectTokenSortable, compareSelectTokens } from "./token-sort";

const makeToken = (overrides: Partial<SelectTokenSortable>): SelectTokenSortable => ({
  path: `gno.land/r/demo/${overrides.name}`,
  type: "GRC20",
  chainId: "dev",
  name: "Token",
  symbol: "TKN",
  displaySymbol: "TKN",
  decimals: 6,
  logoURI: "",
  createdAt: "2024-01-01T00:00:00Z",
  priceID: "",
  isVerified: true,
  usdValue: 0,
  balance: 0,
  ...overrides,
});

const sortNames = (tokens: SelectTokenSortable[]) => [...tokens].sort(compareSelectTokens).map(token => token.name);

describe("compareSelectTokens", () => {
  const gnot = makeToken({ ...GNOT_TOKEN, name: "GNOT" });
  const gns = makeToken({ ...GNS_TOKEN, name: "GNS" });
  const wugnot = makeToken({ ...WUGNOT_TOKEN, name: "wugnot" });

  it("keeps GNOT, GNS, wugnot first when nothing is held, then sorts by name", () => {
    const tokens = [makeToken({ name: "Bravo" }), wugnot, makeToken({ name: "alpha" }), gns, gnot];
    expect(sortNames(tokens)).toEqual(["GNOT", "GNS", "wugnot", "alpha", "Bravo"]);
  });

  it("puts unverified tokens after verified tokens when nothing is held", () => {
    const tokens = [makeToken({ name: "a-unverified", isVerified: false }), makeToken({ name: "z-verified" }), gnot];
    expect(sortNames(tokens)).toEqual(["GNOT", "z-verified", "a-unverified"]);
  });

  it("orders held tokens by USD value, then by balance when there is no USD value", () => {
    const tokens = [
      { ...gnot, usdValue: 5, balance: 100 },
      makeToken({ name: "no-price-small", balance: 10 }),
      makeToken({ name: "rich", usdValue: 50, balance: 1 }),
      makeToken({ name: "no-price-big", balance: 1000 }),
      gns,
    ];
    expect(sortNames(tokens)).toEqual(["rich", "GNOT", "no-price-big", "no-price-small", "GNS"]);
  });

  it("ranks a held unverified token by its balance", () => {
    const tokens = [makeToken({ name: "verified" }), makeToken({ name: "held", isVerified: false, balance: 1 }), gnot];
    expect(sortNames(tokens)).toEqual(["held", "GNOT", "verified"]);
  });
});
