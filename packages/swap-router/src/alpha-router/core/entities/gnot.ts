import invariant from "tiny-invariant";
import { Currency } from "./currency";
import { NativeCurrency } from "./nativeCurrency";
import { Token } from "./token";
import { WGNOT } from "./wgnot";

/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class Gnot extends NativeCurrency {
  public constructor(chainId: number) {
    super(chainId, 6, "GNOT", "Gnot");
  }

  public get wrapped(): Token {
    const wgnot = WGNOT[this.chainId];
    invariant(!!wgnot, "WRAPPED");
    return wgnot;
  }

  private static _gnotCache: { [chainId: number]: Gnot } = {};

  public static onChain(chainId: number): Gnot {
    return (
      this._gnotCache[chainId] ?? (this._gnotCache[chainId] = new Gnot(chainId))
    );
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
}
