import { createTimeout } from "@common/utils/client-util";
import {
  WalletResponse,
  SendTransactionRequestParam,
  AccountInfo,
  SendTransactionResponse,
  isContractMessage,
} from "../protocols";
import { WalletClient } from "../wallet-client";
import { Adena } from "./adena";

export class AdenaClient implements WalletClient {
  private adena: Adena | null;

  constructor() {
    this.adena = null;
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

  public getAccount(): Promise<WalletResponse<AccountInfo>> {
    return createTimeout(this.getAdena().GetAccount());
  }

  public addEstablishedSite = (sitename: string): Promise<WalletResponse> => {
    return createTimeout(this.getAdena().AddEstablish(sitename));
  };

  public sendTransaction = (
    transaction: SendTransactionRequestParam,
  ): Promise<WalletResponse<SendTransactionResponse>> => {
    const request = {
      ...transaction,
      messages: transaction.messages.map(message => {
        if (isContractMessage(message)) {
          return {
            type: "/vm.m_call",
            value: message,
          };
        }
        return {
          type: "/bank.MsgSend",
          value: message,
        };
      }),
    };
    return createTimeout(this.getAdena().DoContract(request));
  };

  public addEventChangedAccount = (callback: (accountId: string) => void) => {
    this.getAdena().On("changedAccount", callback);
  };

  public addEventChangedNetwork = (callback: (networkId: string) => void) => {
    this.getAdena().On("changedNetwork", callback);
  };

  public static createAdenaClient() {
    if (typeof window === "undefined" || typeof window.adena === "undefined") {
      return null;
    }
    return new AdenaClient();
  }
}
