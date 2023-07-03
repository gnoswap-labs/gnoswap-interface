import { GnoClientResponse } from '.';
import { GnoClientApiAbciQuery } from './gno-client-api-abci-query';

export interface GnoClientApi extends GnoClientApiAbciQuery {
  isHealth: () => Promise<boolean>;

  getNetworkInfo: () => Promise<GnoClientResponse.NetworkInfo>;

  getGenesis: () => Promise<GnoClientResponse.Genesis>;

  getBlocks: (minHeight: number, maxHeight: number) => Promise<GnoClientResponse.Blocks>;

  getBlock: (height: number) => Promise<any>;

  getBlockResults: (height: number) => Promise<any>;

  getBlockCommit: (height: number) => Promise<any>;

  getValidators: () => Promise<any>;

  getConsensusState: () => Promise<any>;

  getConsensusParams: (height: number) => Promise<any>;

  getUnconfirmedTxs: () => Promise<any>;

  getNumUnconfirmedTxs: () => Promise<any>;

  getAbciInfo: () => Promise<any>;

  broadcastTxCommit: (tx: string) => Promise<GnoClientResponse.BroadcastTxCommit>;

  broadcastTxSync: (tx: string) => Promise<GnoClientResponse.BroadcastTxSync>;

  broadcastTxAsync: (tx: string) => Promise<GnoClientResponse.BroadcastTxAsync>;

  getTransactionHistory: (address: string, page?: number) => Promise<GnoClientResponse.History>;
}
