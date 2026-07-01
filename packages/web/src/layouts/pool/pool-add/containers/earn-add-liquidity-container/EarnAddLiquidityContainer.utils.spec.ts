import type { TokenModel } from "@models/token/token-model";
import { makeDisplayPrice } from "@utils/pool-utils";
import { resolvePoolAddStartingPrice, snapPoolAddRawStartingPrice } from "./EarnAddLiquidityContainer.utils";

const makeToken = (symbol: string, decimals: number, path = `gno.land/r/demo/${symbol.toLowerCase()}`): TokenModel => ({
  path,
  tokenId: `gno.land/r/demo/${symbol.toLowerCase()}.${symbol}`,
  type: "GRC20",
  chainId: "test-chain",
  name: symbol,
  symbol,
  displaySymbol: symbol,
  decimals,
  logoURI: "",
  createdAt: "",
  priceID: symbol,
});

describe("pool add starting price conversion", () => {
  const foo = makeToken("FOO", 4, "gno.land/r/demo/defi/foo20");
  const gnot = {
    ...makeToken("GNOT", 6, "ugnot"),
    type: "Native",
    wrappedPath: "gno.land/r/gnoland/wugnot",
  } as TokenModel;

  it("converts display price to sorted pool raw price when base token is first in pool order", () => {
    const rawStartingPrice = resolvePoolAddStartingPrice("1", foo, gnot, 60);

    expect(rawStartingPrice).toBeCloseTo(100.26028108160831);
  });

  it("inverts display price before snapping when base token is second in pool order", () => {
    const rawStartingPrice = resolvePoolAddStartingPrice("1", gnot, foo, 60);
    const compareTokenPrice = rawStartingPrice ? 1 / rawStartingPrice : 0;
    const displayPrice = makeDisplayPrice(compareTokenPrice, gnot, foo);

    expect(rawStartingPrice).toBeCloseTo(100.26028108160831);
    expect(displayPrice).toBeCloseTo(0.997404535477);
    expect(displayPrice).not.toBeCloseTo(10_000);
  });

  it("does not apply display-to-raw conversion again when resnapping an existing raw price", () => {
    const rawStartingPrice = resolvePoolAddStartingPrice("1", gnot, foo, 60);

    const resnappedRawStartingPrice = snapPoolAddRawStartingPrice(rawStartingPrice ?? 0, 60);

    expect(resnappedRawStartingPrice).toBeCloseTo(rawStartingPrice ?? 0);
    expect(resnappedRawStartingPrice).not.toBeCloseTo(0.010019462316315);
  });

  it("rejects empty or invalid starting prices", () => {
    expect(resolvePoolAddStartingPrice("", gnot, foo, 60)).toBeNull();
    expect(resolvePoolAddStartingPrice("0", gnot, foo, 60)).toBeNull();
    expect(snapPoolAddRawStartingPrice(0, 60)).toBeNull();
  });
});
