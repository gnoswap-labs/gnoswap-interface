import { GnoClientApi, GnoClientResnpose } from '@/gno-client';
import { Test2ApiFetcher } from './api';

export class NetworkTest2 implements GnoClientApi {
  private fetcher: Test2ApiFetcher;

  constructor() {
    this.fetcher = new Test2ApiFetcher();
  }

  public isHealth = async () => {
    return this.fetcher.getHealth();
  };

  public getNetwrokInfo = async () => {
    return this.fetcher.getNetwrokInfo();
  };

  public getGenesis = async () => {
    return this.fetcher.getGenesis();
  };

  public getBlocks = async (minHeight: number, maxHeight: number) => {
    return this.fetcher.getBlocks(minHeight, maxHeight);
  };

  public getBlock = async (height: number) => {};

  public getBlockResults = async (height: number) => {};

  public getBlockCommit = async (height: number) => {};

  public getValidators = async () => {};

  public getConsensusState = async () => {};

  public getConsensusParams = async (height: number) => {};

  public getUnconfirmedTxs = async () => {};

  public getNumUnconfirmedTxs = async () => {};

  public getAbciInfo = async () => {};

  public broadcastTxCommit = async (tx: string) => {
    return this.fetcher.broadcastTxCommit(tx);
  };

  public broadcastTxSync = async (tx: string) => {
    return this.fetcher.broadcastTxSync(tx);
  };

  public broadcastTxAsync = async (tx: string) => {
    return this.fetcher.broadcastTxAsync(tx);
  };

  public getAccount = async (address: string) => {
    const result = await this.fetcher.executeAbciQuery('GET_ACCOUNT_INFO', { address });
    const plainData = atob(result.response.ResponseBase.Data);
    const accountData: GnoClientResnpose.Account = JSON.parse(plainData);
    return accountData;
  };

  public getBalances = async (address: string) => {
    const result = await this.fetcher.executeAbciQuery('GET_BALANCES', { address });
    const plainData = atob(result.response.ResponseBase.Data);
    const balanceData: string = JSON.parse(plainData);
    return balanceData;
  };
}
