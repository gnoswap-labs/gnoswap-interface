import { NetworkInstance } from '../instance';
import { Test2ABCIQueryType } from './test2-abci-query-type';
import { Test2Api } from './test2-api';

export class Test2Fetcher implements Test2Api {
  private networkInstance: NetworkInstance;

  constructor() {
    this.networkInstance = new NetworkInstance({ host: 'https://rpc.test2.gno.land' });
  }

  public isHealth = () => {};
  public getNetwrokInfo = () => {};
  public getGenesis = () => {};
  public getBlocks = (minHeight: number, maxHeight: number) => {};
  public getBlock = (height: number) => {};
  public getBlockResults = (height: number) => {};
  public getBlockCommit = (height: number) => {};
  public getValidators = () => {};
  public getConsensusState = () => {};
  public getConsensusParams = () => {};
  public getUnconfirmedTxs = () => {};
  public getNumUnconfirmedTxs = () => {};
  public getAbciInfo = () => {};
  public executeAbciQuery = (queryType: Test2ABCIQueryType, request: { [x: string]: any }) => {};
}
