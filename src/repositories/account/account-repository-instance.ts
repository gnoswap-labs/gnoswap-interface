import { WalletClient } from "@/common/clients/wallet-client";
import { InjectSendTransactionRequestParam } from "@/common/clients/wallet-client/protocols/inject-send-transaction-request";
import {
	generateAddress,
	generateNumber,
	generateTime,
	generateNumberPlus,
} from "@/common/utils/test-util";
import { faker } from "@faker-js/faker";
import {
	AccountInfoResponse,
	AccountRepository,
	AccountTransactionResponse,
} from ".";

export class AccountRepositoryInstance implements AccountRepository {
	private walletClient: WalletClient;

	constructor(walletClient: WalletClient) {
		this.walletClient = walletClient;
	}

	public getAccount = async () => {
		const result = await this.walletClient.getAccount();
		return result.data;
	};

	public getTransactions = async (address: string) => {
		return AccountRepositoryInstance.generateTransactions();
	};

	public existsWallet = () => {
		const result = this.walletClient.existsWallet();
		return result;
	};

	public addEstablishedSite = async () => {
		const SITE_NAME = "Gnoswap";
		const result = await this.walletClient.addEstablishedSite(SITE_NAME);
		return result;
	};

	public sendTransaction = async (
		request: InjectSendTransactionRequestParam,
	) => {
		const result = await this.walletClient.sendTransaction(request);
		return result;
	};

	private static generateAccount = () => {
		return {
			status: "ACTIVE",
			address: generateAddress(),
			coins: `${Math.round(generateNumberPlus())}ugnot`,
			publicKey: {
				"@type": generateAddress(),
				value: generateAddress(),
			},
			accountNumber: Math.round(generateNumberPlus()),
			sequence: Math.round(generateNumberPlus()),
			chainId: "test3",
		};
	};

	private static generateTransactions = () => {
		const statusIndex = Math.round(generateNumber(7, 15));
		let txs = [];
		for (let i = 0; i < statusIndex; i++) {
			txs.push(AccountRepositoryInstance.generateTransaction());
		}
		return {
			total: txs.length,
			hits: txs.length,
			txs,
		};
	};

	private static generateTransaction = () => {
		const statusIndex = Math.round(generateNumber(1, 3));
		const statuses = ["SUCCESS", "PENDING", "FAILED"];
		return {
			tx_hash: `${generateNumber(1, 1000)}_0`,
			logo: "https://adena.app/assets/images/logo.svg",
			description: faker.word.interjection(),
			status: statuses[statusIndex % 3] as "SUCCESS" | "PENDING" | "FAILED",
			created_at: generateTime().toUTCString(),
		};
	};
}
