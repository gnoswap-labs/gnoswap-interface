import BigNumber from 'bignumber.js';
import { GasPrice, IGasPriceProvider } from './gas-price-provider';

export class LegacyGasPriceProvider extends IGasPriceProvider {
  constructor() {
    super();
  }

  public override async getGasPrice(): Promise<GasPrice> {
    return {
      gasPriceWei: BigNumber(0),
    };
  }
}
