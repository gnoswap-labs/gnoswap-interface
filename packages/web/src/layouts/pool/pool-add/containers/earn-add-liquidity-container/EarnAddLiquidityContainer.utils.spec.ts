import type { TokenModel } from "@models/token/token-model";
import { resolvePoolAddStartingPrice, snapPoolAddRawStartingPrice } from "./EarnAddLiquidityContainer.utils";

const makeToken = (symbol: string, decimals: number): TokenModel => ({
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
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
  it("converts display price to raw tick price once when creating a pool", () => {
    const gns = makeToken("GNS", 6);
    const foo = makeToken("FOO", 7);

    const rawStartingPrice = resolvePoolAddStartingPrice("1", gns, foo, 60);

    expect(rawStartingPrice).toBeCloseTo(10.013005596803005);
  });

  it("does not apply display-to-raw conversion again when resnapping an existing raw price", () => {
    const gns = makeToken("GNS", 6);
    const foo = makeToken("FOO", 7);
    const rawStartingPrice = resolvePoolAddStartingPrice("1", gns, foo, 60);

    const resnappedRawStartingPrice = snapPoolAddRawStartingPrice(rawStartingPrice ?? 0, 60);

    expect(resnappedRawStartingPrice).toBeCloseTo(rawStartingPrice ?? 0);
    expect(resnappedRawStartingPrice).not.toBeCloseTo(100.26028108160831);
  });

  it("rejects empty or invalid starting prices", () => {
    const gns = makeToken("GNS", 6);
    const foo = makeToken("FOO", 7);

    expect(resolvePoolAddStartingPrice("", gns, foo, 60)).toBeNull();
    expect(resolvePoolAddStartingPrice("0", gns, foo, 60)).toBeNull();
    expect(snapPoolAddRawStartingPrice(0, 60)).toBeNull();
  });
});
