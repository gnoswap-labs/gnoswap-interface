import BigNumber from 'bignumber.js';

import { GasPrice, IGasPriceProvider } from './gas-price-provider';

/**
 * Gets gas prices on chain. If the chain supports EIP-1559 and has the feeHistory API,
 * uses the EIP1559 provider. Otherwise it will use a legacy provider that uses eth_gasPrice
 *
 * @export
 * @class OnChainGasPriceProvider
 */
export class OnChainGasPriceProvider extends IGasPriceProvider {
  constructor() {
    super();
  }

  public override async getGasPrice(): Promise<GasPrice> {
    return {
      gasPriceWei: BigNumber(0),
    };
  }
}
