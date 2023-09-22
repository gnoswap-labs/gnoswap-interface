import { createTimeout } from "@common/utils/client-util";
import {
  WalletResponse,
  SendTransactionRequestParam,
  AccountInfo,
  SendTransactionResponse,
} from "../protocols";
import { WalletClient } from "../wallet-client";
import { Adena } from "./adena";

export class AdenaClient implements WalletClient {
  private adena: Adena | null;

  constructor() {
    this.adena = null;
    this.initAdena();
  }

  public initAdena = () => {
    if (typeof window !== "undefined" && typeof window.adena !== "undefined") {
      this.adena = window.adena;
    }
  };

  private getAdena() {
    if (this.adena === null) {
      throw new Error("Not found");
    }
    return this.adena;
  }

  public existsWallet = (): boolean => {
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
    return createTimeout(this.getAdena().DoContract(transaction));
  };

  public addEventChangedAccount = (callback: (accountId: string) => void) => {
    this.getAdena().On("changedAccount", callback);
  };

  public addEventChangedNetwork = (callback: (networkId: string) => void) => {
    this.getAdena().On("changedNetwork", callback);
  };

  public static createAdenaClient() {
    return new AdenaClient();
  }
}
