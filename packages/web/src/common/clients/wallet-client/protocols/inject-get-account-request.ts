import { InjectResponse } from "./inject-response";

interface AccountInfo {
  status: string;
  address: string;
  coins: string;
  publicKey: {
    "@type": string;
    value: string;
  };
  accountNumber: number;
  sequence: number;
  chainId: string;
}

export interface InjectGetAccountRequest {
  getAccount: () => Promise<InjectResponse<AccountInfo>>;
}
