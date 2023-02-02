import { InjectResponse, InjectSendTransactionRequestParam } from "./protocols";
import { WalletClient } from "./wallet-client";

export type Adena = any;
export class AdenaClient implements WalletClient {
	private adena: Adena | undefined;

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
		return Promise.resolve<InjectResponse<any>>(this.adena.GetAccount());
	};

	public addEstablishedSite = (
		sitename: string,
	): Promise<InjectResponse<any>> => {
		if (!this.existsWallet()) {
			return Promise.resolve(AdenaClient.createError());
		}
		return Promise.resolve<InjectResponse<any>>(
			this.adena.AddEstablish(sitename),
		);
	};

	public sendTransaction = (
		transaction: InjectSendTransactionRequestParam,
	): Promise<InjectResponse<any>> => {
		if (!this.existsWallet()) {
			return Promise.resolve(AdenaClient.createError());
		}
		return Promise.resolve<InjectResponse<any>>(
			this.adena.DoContract(transaction),
		);
	};

	private initAdena = () => {
		if (typeof window !== "undefined" && typeof window.adena !== "undefined") {
			this.adena = window.adena;
		}
	};

	public static createAdenaClient() {
		return new AdenaClient();
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
