import { GnoClientApi, GnoClientResnpose } from '@/api';
import { NetworkConfig } from '../network-config';
import { CommonApiFetcher, CommonMapper, CommonResponse } from './api';

export class NetworkCommon implements GnoClientApi {
  private fetcher: CommonApiFetcher;

  constructor(config: NetworkConfig) {
    this.fetcher = new CommonApiFetcher(config);
  }

  public isHealth = async () => {
    return this.fetcher.getHealth();
  };

  public getNetwrokInfo = async () => {
    const networkInfoOfCommon = await this.fetcher.getNetwrokInfo();
    const networkInfo = CommonMapper.StatusMapper.toNetworkInfo(networkInfoOfCommon);
    return networkInfo;
  };

  public getGenesis = async () => {
    const genesisOfCommon = await this.fetcher.getGenesis();
    const genesis = CommonMapper.GenesisMapper.toGenesis(genesisOfCommon);
    return genesis;
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
    const txCommitResponseOfCommon = await this.fetcher.broadcastTxCommit(tx);
    const txCommitResponse =
      CommonMapper.BroadcastTxCommitMapper.toBroadcastTxCommit(txCommitResponseOfCommon);
    return txCommitResponse;
  };

  public broadcastTxSync = async (tx: string) => {
    return this.fetcher.broadcastTxSync(tx);
  };

  public broadcastTxAsync = async (tx: string) => {
    return this.fetcher.broadcastTxAsync(tx);
  };

  public getAccount = async (address: string) => {
    const result = await this.fetcher.executeAbciQuery('GET_ACCOUNT_INFO', { address });
    if (!result.response?.ResponseBase?.Data || result.response?.ResponseBase?.Data === null) {
      return GnoClientResnpose.AccountNone;
    }

    const plainData = atob(result.response.ResponseBase.Data);
    const accountDataOfCommon: CommonResponse.AbciQueryAuthAccount | null = JSON.parse(plainData);
    const accountData = CommonMapper.AbciQueryAuthAccountMapper.toAccount(accountDataOfCommon);
    return accountData;
  };

  public getBalances = async (address: string) => {
    const result = await this.fetcher.executeAbciQuery('GET_BALANCES', { address });
    if (!result.response?.ResponseBase?.Data || result.response?.ResponseBase?.Data === null) {
      return GnoClientResnpose.BalancesDefault;
    }

    const plainData = atob(result.response.ResponseBase.Data);
    const balanceDataOfCommon: string = JSON.parse(plainData);
    const balanceData = CommonMapper.AbciQueryBankBalancesMapper.toBalances(balanceDataOfCommon);
    return balanceData;
  };

  public getTransactionHistory = async (address: string) => {
    return this.fetcher.getTransactionHistory(address);
  };
}
