import { InjectResponse, InjectSendTransactionRequestParam } from "./protocols";
import { WalletClient } from "./wallet-client";

export type Adena = any;
export class AdenaClient implements WalletClient {
  private adena: Adena | undefined;

  private static TIMEOUT = 15 * 60 * 1000;

  constructor() {
    this.adena = undefined;
  }

  public existsWallet = (): boolean => {
    this.initAdena();
    return this.adena !== undefined;
  };

  public getAccount = (): Promise<InjectResponse<any>> => {
    if (!this.existsWallet()) {
      return Promise.resolve(AdenaClient.createError());
    }
    return AdenaClient.createTimeout(this.adena.GetAccount());
  };

  public addEstablishedSite = (
    sitename: string,
  ): Promise<InjectResponse<any>> => {
    if (!this.existsWallet()) {
      return Promise.resolve(AdenaClient.createError());
    }
    return AdenaClient.createTimeout(this.adena.AddEstablish(sitename));
  };

  public sendTransaction = (
    transaction: InjectSendTransactionRequestParam,
  ): Promise<InjectResponse<any>> => {
    if (!this.existsWallet()) {
      return Promise.resolve(AdenaClient.createError());
    }
    return AdenaClient.createTimeout(this.adena.DoContract(transaction));
  };

  private initAdena = () => {
    if (typeof window !== "undefined" && typeof window.adena !== "undefined") {
      this.adena = window.adena;
    }
  };

  public static createAdenaClient() {
    return new AdenaClient();
  }

  private static async createTimeout<T>(
    promise: Promise<T>,
    milliseconds?: number,
  ): Promise<T> {
    milliseconds = milliseconds ?? AdenaClient.TIMEOUT;
    let timer: number | NodeJS.Timeout;
    const response = await Promise.race([
      promise,
      new Promise<"timeout">(resolve => {
        timer = setTimeout(() => resolve("timeout"), milliseconds);
      }),
    ] as const).finally(() => clearTimeout(timer));

    if (response === "timeout") {
      throw new Error("Adena timeout");
    }
    return response;
  }

  private static createError(): InjectResponse<null> {
    return {
      code: 404,
      data: null,
      message: "Not Found Wallet",
      status: "",
      type: "",
    };
  }
}
