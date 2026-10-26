import { createTimeout } from "@common/utils/client-util";
import { DEFAULT_GAS_WANTED } from "@common/values";
import { Tx, TxSignature } from "@gnolang/tm2-js-client";
import { WalletType } from "src/types/wallet.types";
import {
  AccountInfo,
  SendTransactionRequestParam,
  SendTransactionResponse,
  SignArbitraryRequestParam,
  SignedArbitraryData,
  WalletResponse,
  isContractMessage,
  isRunMessage,
} from "../protocols";
import { AddNetworkRequestParam, AddNetworkResponse, SwitchNetworkResponse } from "../protocols/wallet-network";
import { WalletClient } from "../wallet-client";
import { Adena, ContractOptions } from "./adena";
import { parseTransactionResponse } from "./adena-client.util";

export class AdenaClient implements WalletClient {
  private adena: Adena | null;
  private address: string | null;
  private defaultMemo: string | null;

  constructor(defaultMemo?: string) {
    this.adena = null;
    this.address = null;
    this.defaultMemo = defaultMemo || null;
  }

  public initAdena = () => {
    if (typeof window !== "undefined" && typeof window.adena !== "undefined") {
      this.adena = window.adena;
    }
  };

  private getAdena() {
    this.initAdena();
    if (this.adena === null) {
      throw new Error("Not found");
    }
    return this.adena;
  }

  public existsWallet = (): boolean => {
    this.initAdena();
    return this.adena !== null;
  };

  public getWalletType(): WalletType {
    return "ADENA";
  }

  public async getAddress(): Promise<string | null> {
    if (!this.address) {
      return this.getAccount().then(account => account.data?.address || null);
    }

    return this.address;
  }

  public async getAccount(): Promise<WalletResponse<AccountInfo>> {
    const accountInfo = await createTimeout(this.getAdena().GetAccount());
    if (!!accountInfo.data.address) {
      this.address = accountInfo.data.address;
    }

    return accountInfo;
  }

  public async sign(): Promise<{ signed: Tx; signature: TxSignature[] }> {
    throw new Error("Sign method not implemented for Adena wallet");
  }

  public signArbitrary = (request: SignArbitraryRequestParam): Promise<WalletResponse<SignedArbitraryData>> => {
    const adena = this.getAdena();
    if (!adena.SignArbitrary) {
      return Promise.resolve({
        // Same response the SDK returns for an extension without SignArbitrary.
        code: 4005,
        status: "failure",
        type: "UNSUPPORTED_TYPE",
        message: "Adena does not support the requested transaction type.",
        data: null,
      });
    }

    // No timeout: the user may take a while to review the message in the approval popup.
    return adena.SignArbitrary(request);
  };

  public addEstablishedSite = (sitename: string): Promise<WalletResponse> => {
    return createTimeout(this.getAdena().AddEstablish(sitename));
  };

  public sendTransaction = <T = string[]>(
    transaction: SendTransactionRequestParam,
  ): Promise<WalletResponse<SendTransactionResponse<T | null>>> => {
    const { withNotification = false, ...transactionRequest } = transaction;
    const options: ContractOptions = {
      withNotification,
      isVisibleResult: withNotification,
    };
    const request = {
      ...transactionRequest,
      messages: transactionRequest.messages.map(message => {
        if (isContractMessage(message)) {
          return {
            type: "/vm.m_call",
            value: message,
          };
        }
        if (isRunMessage(message)) {
          return {
            type: "/vm.m_run",
            value: message,
          };
        }
        return {
          type: "/bank.MsgSend",
          value: message,
        };
      }),
      gasWanted: transactionRequest.gasWanted || DEFAULT_GAS_WANTED,
      memo: transactionRequest.memo || this.defaultMemo || "",
    };
    return createTimeout<WalletResponse<SendTransactionResponse<T | null>>>(
      this.getAdena()
        .DoContract(request, options)
        .then(response => {
          console.log("Injection Response", response);
          return parseTransactionResponse(response) as WalletResponse<SendTransactionResponse<T | null>>;
        }),
    );
  };

  public addEventChangedAccount = (callback: (accountId: string) => void) => {
    this.getAdena().On("changedAccount", (address: string) => {
      this.address = address;
      callback(address);
    });
  };

  public addEventChangedNetwork = (callback: (networkId: string) => void) => {
    this.getAdena().On("changedNetwork", callback);
  };

  public static createAdenaClient(defaultMemo?: string) {
    if (typeof window === "undefined" || typeof window.adena === "undefined") {
      return null;
    }
    return new AdenaClient(defaultMemo);
  }

  public switchNetwork = (chainId: string): Promise<WalletResponse<SwitchNetworkResponse>> => {
    return createTimeout(this.getAdena().SwitchNetwork(chainId));
  };

  public addNetwork = (network: AddNetworkRequestParam): Promise<WalletResponse<AddNetworkResponse>> => {
    return createTimeout(this.getAdena().AddNetwork(network));
  };

  public async disconnect(): Promise<void> {
    this.adena = null;
    this.address = null;
  }
}
