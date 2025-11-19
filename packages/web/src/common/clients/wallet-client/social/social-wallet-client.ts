import {
  AdenaSDK,
  GnoSocialWalletProvider,
  TransactionMessage as SDKTransactionMessage,
  SocialEmailPasswordlessConfigure,
  SocialGoogleConfigure,
  SocialTwitterConfigure,
  WalletResponseExecuteType,
  makeMsgCallMessage,
  makeMsgSendMessage,
  TransactionBuilder,
} from "@adena-wallet/sdk";
import { base64ToUint8Array, Provider, Tx, TxSignature } from "@gnolang/tm2-js-client";

import { createTimeout } from "@common/utils/client-util";
import { DEFAULT_GAS_WANTED } from "@common/values";
import { DEFAULT_CHAIN_ID } from "@constants/environment.constant";
import { SocialLoginType, WalletType } from "src/types/wallet.types";
import { AdenaSendTransactionSuccessResponse } from "../adena/adena";
import { parseTransactionResponse } from "../adena/adena-client.util";
import {
  AccountInfo,
  AddNetworkRequestParam,
  AddNetworkResponse,
  DEFAULT_ACCOUNT_INFO,
  SendTransactionRequestParam,
  SendTransactionResponse,
  SwitchNetworkResponse,
  WalletResponse,
  isContractMessage,
} from "../protocols";
import { WalletClient } from "../wallet-client";
import { getSocialWalletConfig } from "./config";
import { GNOT_UNIT_DENOM } from "@common/values/token-constant";
import { AUTH_STORE_KEY } from "@hooks/common/use-auto-disconnect";
import { documentToTx } from "@utils/transaction-utils";
import { Document } from "src/types/transaction-messages.types";

export class SocialWalletClient implements WalletClient {
  private sdk: AdenaSDK | null;
  private provider: GnoSocialWalletProvider | null;
  private address: string | null;
  private _type: SocialLoginType | null;
  private _email: string | null;

  constructor() {
    this.sdk = null;
    this.provider = null;
    this.address = null;
    this._type = null;
    this._email = null;
  }

  public async disconnect() {
    try {
      await this.sdk?.disconnectWallet();

      this.sdk = null;
      this.provider = null;
      this.address = null;
      this._type = null;
      this._email = null;
      localStorage.removeItem(AUTH_STORE_KEY);
    } catch (error) {
      console.error("Failed to disconnect social wallet:", error);
      throw error;
    }
  }

  public async initSocialWallet(loginType: SocialLoginType, email?: string) {
    const config = getSocialWalletConfig(loginType, email);
    const provider = await this.createSocialWalletProvider(loginType, config);
    this.provider = provider;
    this.sdk = new AdenaSDK(provider);
    this._type = loginType;
    await this.sdk.connectWallet();
  }

  private getSocialWallet() {
    if (!this.provider || !this.sdk) {
      throw new Error("Social wallet not initialized");
    }
    return this.provider;
  }

  private createSocialWalletProvider(
    loginType: SocialLoginType,
    config: SocialGoogleConfigure | SocialTwitterConfigure | SocialEmailPasswordlessConfigure,
  ): Promise<GnoSocialWalletProvider> {
    switch (loginType) {
      case "email":
        return GnoSocialWalletProvider.createEmailPasswordless(config as SocialEmailPasswordlessConfigure);
      case "google":
        return GnoSocialWalletProvider.createGoogle(config as SocialGoogleConfigure);
      case "twitter":
        return GnoSocialWalletProvider.createTwitter(config as SocialTwitterConfigure);
    }
  }

  public existsWallet = (): boolean => {
    return this.provider !== null && this.sdk !== null;
  };

  public getWalletType(): WalletType {
    return "SOCIAL_WALLET";
  }

  public getLoginType(): SocialLoginType | null {
    return this._type;
  }

  public get type(): SocialLoginType | null {
    return this._type;
  }

  public async sign(provider: Provider, document: Document): Promise<{ signed: Tx; signature: TxSignature[] }> {
    if (!this.sdk) {
      throw new Error("Social wallet not initialized");
    }

    const tx = documentToTx(document);
    const { data } = await this.sdk.signTransaction({ tx });

    if (!data?.encodedTransaction) {
      return {
        signed: tx,
        signature: [],
      };
    }

    const decodedTransaction = base64ToUint8Array(data.encodedTransaction);
    const signedTx = Tx.decode(decodedTransaction);

    return {
      signed: signedTx,
      signature: [],
    };
  }

  public async getAddress(): Promise<string | null> {
    if (!this.address) {
      return this.getAccount().then(account => account.data?.address || null);
    }
    return this.address;
  }

  public async getAccount(): Promise<WalletResponse<AccountInfo>> {
    const accountInfo = (await createTimeout(this.getSocialWallet().getAccount())) as WalletResponse<AccountInfo>;

    let email = "";
    if (this.sdk) {
      try {
        email = await this.getUserEmail();
        this._email = email;
      } catch (error) {
        console.log("Failed to get user email: ", error);
      }
    }

    if (!accountInfo.data && accountInfo.type === "NO_ACCOUNT") {
      const newAddress = await this.provider?.getWallet()?.getAddress();
      return {
        status: "success",
        code: 0,
        type: WalletResponseExecuteType.GET_ACCOUNT,
        message: "Account not found",
        data: {
          ...DEFAULT_ACCOUNT_INFO,
          chainId: DEFAULT_CHAIN_ID || "",
          address: newAddress || "",
          email,
        },
      };
    }

    if (accountInfo.data && !!accountInfo.data.address) {
      this.address = accountInfo.data?.address;
      accountInfo.data.email = email;
    }

    return accountInfo;
  }

  public addEstablishedSite = async (sitename: string): Promise<WalletResponse> => {
    if (!this.sdk) {
      throw new Error("Social wallet not initialized");
    }
    const response = await createTimeout(this.sdk.addEstablish({ siteName: sitename }));
    return {
      status: response.status,
      code: response.code,
      type: response.type,
      message: response.message,
      data: response.data ? { hash: "" } : null,
    };
  };

  public sendTransaction = async <T = string[]>(
    transaction: SendTransactionRequestParam,
  ): Promise<WalletResponse<SendTransactionResponse<T | null>>> => {
    // Check if the SDK is initialized
    if (!this.sdk) {
      throw new Error("Social wallet not initialized");
    }

    // Convert messages from an incoming transaction to SDK format
    const messages: SDKTransactionMessage[] = transaction.messages.map(message => {
      if (isContractMessage(message)) {
        return makeMsgCallMessage({
          ...message,
          max_deposit: "",
          args: message.args?.map(arg => `${arg}`) || [],
        });
      }
      return makeMsgSendMessage(message);
    });

    const tx = TransactionBuilder.create()
      .messages(...messages)
      .gasWanted(transaction.gasWanted || DEFAULT_GAS_WANTED)
      .fee(transaction.gasFee || 1000000, GNOT_UNIT_DENOM)
      .memo(transaction.memo || "")
      .build();

    // Broadcasting transactions to the network with broadcastTransaction
    return createTimeout<WalletResponse<SendTransactionResponse<T | null>>>(
      this.sdk.broadcastTransaction({ tx }).then(response => {
        return parseTransactionResponse(
          response as WalletResponse<AdenaSendTransactionSuccessResponse>,
        ) as WalletResponse<SendTransactionResponse<T | null>>;
      }),
    );
  };

  public addEventChangedAccount = (callback: (accountId: string) => void) => {
    if (!this.sdk) {
      throw new Error("Social wallet not initialized");
    }

    this.sdk.onChangeAccount({
      callback: (address: string) => {
        this.address = address;
        callback(address);
      },
    });
  };

  public addEventChangedNetwork = (callback: (networkId: string) => void) => {
    if (!this.sdk) {
      throw new Error("Social wallet not initialized");
    }

    this.sdk.onChangeAccount({
      callback: callback,
    });
  };

  public static async createSocialWalletClient(loginType: SocialLoginType, email?: string) {
    if (typeof window === "undefined") {
      return null;
    }

    const client = new SocialWalletClient();

    try {
      await client.initSocialWallet(loginType, email);
      return client;
    } catch (error) {
      console.error("Failed to initialize Social wallet:", error);
      return null;
    }
  }

  public addNetwork = (network: AddNetworkRequestParam): Promise<WalletResponse<AddNetworkResponse>> => {
    if (!this.sdk) {
      throw new Error("Social wallet not initialized");
    }
    return createTimeout(
      this.sdk.addNetwork({
        chainId: network.chainId,
        chainName: network.chainName,
        rpcUrl: network.rpcUrl,
      }) as Promise<WalletResponse<AddNetworkResponse>>,
    );
  };

  public switchNetwork = (chainId: string): Promise<WalletResponse<SwitchNetworkResponse>> => {
    if (!this.sdk) {
      throw new Error("Social wallet not initialized");
    }
    return createTimeout(this.sdk.switchNetwork({ chainId })) as Promise<WalletResponse<SwitchNetworkResponse>>;
  };

  public getUserEmail = async () => {
    if (!this.sdk) {
      throw new Error("Social wallet not initialized");
    }
    const userInfo = await this.sdk.getSocialUserProfile();

    return userInfo?.email || userInfo?.name || "";
  };
}
