import {
  AdenaSDK,
  GnoSocialWalletProvider,
  TransactionBuilder,
  TransactionMessage as SDKTransactionMessage,
  WalletResponseExecuteType,
} from "@adena-wallet/sdk";
import { createTimeout } from "@common/utils/client-util";
import { DEFAULT_GAS_WANTED } from "@common/values";
import { SocialLoginType, WalletType } from "src/types/wallet.types";
import { SocialWalletConfig } from "./config";
import {
  WalletResponse,
  AccountInfo,
  SendTransactionRequestParam,
  SendTransactionResponse,
  isContractMessage,
  AddNetworkRequestParam,
  AddNetworkResponse,
  SwitchNetworkResponse,
  DEFAULT_ACCOUNT_INFO,
} from "../protocols";
import { WalletClient } from "../wallet-client";
import { getSocialWalletConfig } from "./config";
import { parseTransactionResponse } from "../adena/adena-client.util";
import { AdenaSendTransactionSuccessResponse } from "../adena/adena";
import { DEFAULT_CHAIN_ID } from "@constants/environment.constant";

export class SocialWalletClient implements WalletClient {
  private sdk: AdenaSDK | null;
  private provider: GnoSocialWalletProvider | null;
  private address: string | null;
  private _type: SocialLoginType | null;

  constructor() {
    this.sdk = null;
    this.provider = null;
    this.address = null;
    this._type = null;
  }

  public async initSocialWallet(loginType: SocialLoginType) {
    const config = getSocialWalletConfig(loginType);
    const provider = this.createSocialWalletProvider(loginType, config);
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

  private createSocialWalletProvider(loginType: SocialLoginType, config: SocialWalletConfig) {
    switch (loginType) {
      case "email":
        return GnoSocialWalletProvider.createEmail(config);
      case "google":
        return GnoSocialWalletProvider.createGoogle(config);
      case "twitter":
        return GnoSocialWalletProvider.createTwitter(config);
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

  public async getAddress(): Promise<string | null> {
    if (!this.address) {
      return this.getAccount().then(account => account.data?.address || null);
    }
    return this.address;
  }

  public async getAccount(): Promise<WalletResponse<AccountInfo>> {
    const accountInfo = (await createTimeout(this.getSocialWallet().getAccount())) as WalletResponse<AccountInfo>;
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
        },
      };
    }

    if (accountInfo.data && !!accountInfo.data.address) {
      this.address = accountInfo.data?.address;
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
    if (!this.sdk) {
      throw new Error("Social wallet not initialized");
    }

    const messages: SDKTransactionMessage[] = transaction.messages.map(message => {
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
    });

    const tx = TransactionBuilder.create()
      .messages(...messages)
      .gasWanted(transaction.gasWanted || DEFAULT_GAS_WANTED)
      .memo(transaction.memo || "")
      .build();

    return createTimeout<WalletResponse<SendTransactionResponse<T | null>>>(
      this.sdk.broadcastTransaction({ tx }).then(response => {
        console.log("Social Wallet Response", response);
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

  public static async createSocialWalletClient(loginType: SocialLoginType) {
    if (typeof window === "undefined") {
      return null;
    }

    const client = new SocialWalletClient();
    if (loginType) {
      try {
        await client.initSocialWallet(loginType);
        return client;
      } catch (error) {
        console.error("Failed to initialize Social wallet:", error);
        return null;
      }
    }

    return new SocialWalletClient();
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

  public static async initializeSocialWalletClient(type: SocialLoginType) {
    const client = new SocialWalletClient();
    if (!client) {
      return null;
    }

    await client.initSocialWallet(type);
    return client;
  }
}
