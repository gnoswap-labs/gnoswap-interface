import { AccountWalletMapper } from "./../../models/account/mapper/account-wallet-mapper";
import { TransactionModel } from "./../../models/account/account-history-model";
import { StatusOptions } from "@/common/values/data-constant";
import { AccountInfoMapper } from "@/models/account/mapper/account-info-mapper";
import { AccountRepository } from "@/repositories/account";
import { returnNullWithLog } from "@/common/utils/error-util";

export class AccountService {
	private accountRepository: AccountRepository;

	constructor(accountRepository: AccountRepository) {
		this.accountRepository = accountRepository;
	}

	public getAccountInfo = async () => {
		return await this.accountRepository
			.getAccount()
			.then(AccountInfoMapper.fromResopnse)
			.catch(returnNullWithLog);
	};

	public connectAdenaWallet = async () => {
		const existsWalletCheck = this.accountRepository.existsWallet();
		if (!existsWalletCheck) return false;
		return await this.accountRepository
			.addEstablishedSite()
			.then(AccountWalletMapper.fromResopnse)
			.catch(returnNullWithLog);
	};

	public disconnectAdenaWallet = async () => {};

	public getNotifications = async (address: string) => {
		return await this.accountRepository
			.getNotificationsByAddress(address)
			.catch(returnNullWithLog);
	};

	public createNotification = async (
		address: string,
		transaction: TransactionModel,
	) => {
		return await this.accountRepository
			.createNotification(address, transaction)
			.catch(returnNullWithLog);
	};

	public updateNotificationStatus = async (
		address: string,
		txHash: string,
		status: StatusOptions,
	) => {
		return await this.accountRepository
			.updateNotificationStatus(address, txHash, status)
			.catch(returnNullWithLog);
	};

	public deleteAllNotification = async (address: string) => {
		return await this.accountRepository
			.deleteAllNotifications(address)
			.catch(returnNullWithLog);
	};
}
