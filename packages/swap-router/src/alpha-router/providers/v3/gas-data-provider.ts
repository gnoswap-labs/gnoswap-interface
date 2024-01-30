import { GnoProvider } from "@gnolang/gno-js-client";
import BigNumber from "bignumber.js";
import { ChainId } from "../../core";

/**
 * Provider for getting gas constants on L2s.
 *
 * @export
 * @interface IGnoGasDataProvider
 */
export interface IGnoGasDataProvider<T> {
  /**
   * Gets the data constants needed to calculate the l1 security fee on L2s like arbitrum and Gno.
   * @returns An object that includes the data necessary for the off chain estimations.
   */
  getGasData(): Promise<T>;
}

export type GnoGasData = {
  l1BaseFee: BigNumber;
  scalar: BigNumber;
  decimals: BigNumber;
  overhead: BigNumber;
};

export class GnoGasDataProvider implements IGnoGasDataProvider<GnoGasData> {
  protected gasOracleAddress: string;

  constructor(
    protected chainId: ChainId,
    protected gnoProvider: GnoProvider,
    gasPriceAddress?: string,
  ) {
    this.gasOracleAddress = gasPriceAddress ?? "";
  }

  public async getGasData(): Promise<GnoGasData> {
    return {
      l1BaseFee: BigNumber(0),
      scalar: BigNumber(0),
      decimals: BigNumber(0),
      overhead: BigNumber(0),
    };
  }
}
