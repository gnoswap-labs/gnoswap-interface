import { NetworkTest2 } from '..';
import { GnoClientApi } from './api';

export class GnoClient implements GnoClientApi {
  private network: GnoClientApi;

  constructor(network: GnoClientApi) {
    this.network = network;
  }

  public static createByNetworkTest2() {
    return new GnoClient(new NetworkTest2());
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
}
