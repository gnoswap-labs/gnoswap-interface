import { NetworkConfig } from './network';
import { GnoClientApi } from './api';
import { NetworkCommon } from './network/common';

type MapperType = 'MAIN' | 'TEST2' | 'TEST3' | 'COMMON' | 'NONE';
export class GnoClient implements GnoClientApi {
  private network: GnoClientApi;

  private networkConfig: NetworkConfig;

  private mapperType: MapperType;

  constructor(network: GnoClientApi, networkConfig: NetworkConfig, mapperType: MapperType) {
    this.network = network;
    this.networkConfig = networkConfig;
    this.mapperType = mapperType;
  }

  public get chainId() {
    return this.networkConfig.chainId;
  }

  public get chainName() {
    return this.networkConfig.chainName;
  }

  public get url() {
    return this.networkConfig.rpcUrl;
  }

  public get gasPrice() {
    return this.networkConfig.gasPrice;
  }

  public get token() {
    return this.networkConfig.token;
  }

  public static createNetwork(networkConfig: NetworkConfig) {
    return new GnoClient(new NetworkCommon(networkConfig), networkConfig, 'COMMON');
  }

  public static createNetworkByType(networkConfig: NetworkConfig, mapperType: MapperType) {
    return new GnoClient(new NetworkCommon(networkConfig), networkConfig, mapperType);
  }

  public get mapperVersion() {
    return this.mapperType;
  }

  public isHealth = async () => this.network.isHealth();

  public getNetwrokInfo = async () => this.network.getNetwrokInfo();

  public getGenesis = async () => this.network.getGenesis();

  public getBlocks = async (minHeight: number, maxHeight: number) =>
    this.network.getBlocks(minHeight, maxHeight);

  public getBlock = async (height: number) => this.network.getBlock(height);

  public getBlockResults = async (height: number) => this.network.getBlockResults(height);

  public getBlockCommit = async (height: number) => this.network.getBlockCommit(height);

  public getValidators = async () => this.network.getValidators();

  public getConsensusState = async () => this.network.getConsensusState();

  public getConsensusParams = async (height: number) => this.network.getConsensusParams(height);

  public getUnconfirmedTxs = async () => this.network.getUnconfirmedTxs();

  public getNumUnconfirmedTxs = async () => this.network.getNumUnconfirmedTxs();

  public getAbciInfo = async () => this.network.getAbciInfo();

  public broadcastTxCommit = async (tx: string) => this.network.broadcastTxCommit(tx);

  public broadcastTxSync = async (tx: string) => this.network.broadcastTxSync(tx);

  public broadcastTxAsync = async (tx: string) => this.network.broadcastTxAsync(tx);

  public getAccount = async (address: string) => this.network.getAccount(address);

  public getBalances = async (address: string) => this.network.getBalances(address);

  public getTransactionHistory = async (address: string) =>
    this.network.getTransactionHistory(address);
}
