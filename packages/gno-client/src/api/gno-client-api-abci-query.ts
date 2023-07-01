import { GnoClientResponse } from '.';

export interface GnoClientApiAbciQuery {
  getAccount: (address: string) => Promise<GnoClientResponse.Account>;

  getBalances: (address: string) => Promise<GnoClientResponse.Balances>;

  queryRender: (packagePath: string, datas?: Array<string>) => Promise<GnoClientResponse.AbciQuery | null>;

  queryEval: (packagePath: string, functionName: string, datas?: Array<string>) => Promise<GnoClientResponse.AbciQuery | null>;

  queryPackage: (packagePath: string) => Promise<GnoClientResponse.AbciQuery | null>;

  queryFile: (packagePath: string) => Promise<GnoClientResponse.AbciQuery | null>;

  queryFunctions: (packagePath: string) => Promise<GnoClientResponse.AbciQuery | null>;

  queryStore: (packagePath: string) => Promise<GnoClientResponse.AbciQuery | null>;
}
