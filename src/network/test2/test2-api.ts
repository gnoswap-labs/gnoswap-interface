import { Test2ABCIQueryType } from '.';

export interface Test2Api {
  isHealth: () => any;

  getNetwrokInfo: () => any;

  getGenesis: () => any;

  getBlocks: (minHeight: number, maxHeight: number) => any;

  getBlock: (height: number) => any;

  getBlockResults: (height: number) => any;

  getBlockCommit: (height: number) => any;

  getValidators: () => any;

  getConsensusState: () => any;

  getConsensusParams: () => any;

  getUnconfirmedTxs: () => any;

  getNumUnconfirmedTxs: () => any;

  getAbciInfo: () => any;

  executeAbciQuery: (queryType: Test2ABCIQueryType, request: { [key in string]: any }) => any;
}
