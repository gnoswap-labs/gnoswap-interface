import {
	generateAddress,
	generateNumber,
	generateTime,
	generateToken0,
} from "@/common/utils/test-util";
import { faker } from "@faker-js/faker";
import {
	AccountInfoResposne,
	AccountRepository,
	AccountTransactionResponse,
} from ".";

export class AccountRepositoryMock implements AccountRepository {
	public getAccount = async (): Promise<AccountInfoResposne> => {
		return AccountRepositoryMock.generateAccount();
	};

	public getTransactions = async (
		address: string,
	): Promise<AccountTransactionResponse> => {
		return AccountRepositoryMock.generateTransactions();
	};

	private static generateAccount = () => {
		return {
			address: generateAddress(),
			username: faker.name.firstName(),
			amount: generateToken0(),
		};
	};

	private static generateTransactions = () => {
		const statusIndex = Math.round(generateNumber(7, 15));
		let transactions = [];
		for (let i = 0; i < statusIndex; i++) {
			transactions.push(AccountRepositoryMock.generateTransaction());
		}
		return {
			transactions,
		};
	};

	private static generateTransaction = () => {
		const statusIndex = Math.round(generateNumber(1, 3));
		const statuses = ["success", "pending", "failed"];
		return {
			tx_logo: "https://adena.app/assets/images/logo.svg",
			tx_hash: `${generateNumber(1, 1000)}_0`,
			desc: faker.word.interjection(),
			status: statuses[statusIndex % 3] as "success" | "pending" | "failed",
			created_at: generateTime().toUTCString(),
		};
	};
}
