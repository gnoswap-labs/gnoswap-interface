import {
  AdenaSDK,
  GnoSocialWalletProvider,
  TransactionMessage as SDKTransactionMessage,
  SocialCustomConfigure,
  SocialGoogleConfigure,
  SocialTwitterConfigure,
  WalletResponseExecuteType,
  makeMsgCallMessage,
  makeMsgSendMessage,
} from "@adena-wallet/sdk";
import { Tx, base64ToUint8Array } from "@gnolang/tm2-js-client";

import { createTimeout } from "@common/utils/client-util";
import { DEFAULT_GAS_WANTED } from "@common/values";
import { DEFAULT_CHAIN_ID } from "@constants/environment.constant";
import { createDocument, documentToTx } from "@utils/messages.utils";
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

  public async disconnect() {
    try {
      await this.sdk?.disconnectWallet();

      this.sdk = null;
      this.provider = null;
      this.address = null;
      this._type = null;
    } catch (error) {
      console.error("Failed to disconnect social wallet:", error);
      throw error;
    }
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

  private createSocialWalletProvider(
    loginType: SocialLoginType,
    config: SocialGoogleConfigure | SocialTwitterConfigure | SocialCustomConfigure,
  ) {
    switch (loginType) {
      case "email":
        return GnoSocialWalletProvider.createEmail(config as SocialCustomConfigure);
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
    // Check if the SDK is initialized
    if (!this.sdk) {
      throw new Error("Social wallet not initialized");
    }

    // Convert messages from an incoming transaction to SDK format
    const messages: SDKTransactionMessage[] = transaction.messages.map(message => {
      if (isContractMessage(message)) {
        return makeMsgCallMessage({
          ...message,
          args: message.args?.map(arg => `${arg}`) || null,
        });
      }
      return makeMsgSendMessage(message);
    });

    // Get Current account information
    const account = await this.sdk.getAccount();
    // Create a document from the account information and messages
    const document = createDocument({
      accountNumber: Number(account.data?.accountNumber) || 0,
      accountSequence: Number(account.data?.sequence) || 0,
      chainId: DEFAULT_CHAIN_ID || "",
      messages,
      gasWanted: transaction.gasWanted || DEFAULT_GAS_WANTED,
      gasFee: transaction.gasFee || 1000000,
      memo: transaction.memo || "",
    });
    // Convert Document to Tx format (documentToTx)
    const tx = documentToTx(document);

    // Signing transactions with signTransaction in the SDK
    const signedTxResponse = await this.sdk.signTransaction({ tx });
    // Decode the signed transaction and broadcast it to the network using broadcastTransaction in the SDK
    const decoded = base64ToUint8Array(signedTxResponse.data?.encodedTransaction || "");
    if (!decoded) {
      return {
        status: "error",
        code: 1,
        type: WalletResponseExecuteType.SIGN_TX,
        message: "Failed to sign transaction",
        data: null,
      };
    }

    // Binary data converted from base64-encoded transactions to Uint8Array
    const signedTx = Tx.decode(decoded);

    // Broadcasting transactions to the network with broadcastTransaction
    return createTimeout<WalletResponse<SendTransactionResponse<T | null>>>(
      this.sdk.broadcastTransaction({ tx: signedTx }).then(response => {
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

  public getUserEmail = async () => {
    if (!this.sdk) {
      throw new Error("Social wallet not initialized");
    }
    const userInfo = await this.sdk.getSocialUserProfile();

    return userInfo?.email || "";
  };
}
