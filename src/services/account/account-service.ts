import { TransactionModel } from "./../../models/account/account-history-model";
import { StatusOptions } from "@/common/values/data-constant";
import { StorageClient } from "./../../common/clients/storage-client/storage-client";
import { AccountHistoryMapper } from "./../../models/account/mapper/account-history-mapper";
import { AccountInfoMapper } from "@/models/account/mapper/account-info-mapper";
import { AccountRepository } from "@/repositories/account";
import { returnNullWithLog } from "@/common/utils/error-util";
import { AccountError } from "@/common/errors/account";

export class AccountService {
	private accountRepository: AccountRepository;

	constructor(accountRepository: AccountRepository) {
		this.accountRepository = accountRepository;
	}

	public getAccountInfo = async () => {
		const accountInfo = await this.accountRepository.getAccount();
		return AccountInfoMapper.fromResopnse(accountInfo);
	};

	public connectAdenaWallet = async () => {
		const existsWalletCheck = this.accountRepository.existsWallet();
		if (!existsWalletCheck) return false;
		return await this.accountRepository
			.addEstablishedSite()
			.then(res => ([0, 4001].includes(res.code) ? true : false))
			.catch(err => {
				return err;
			});
	};

	public disconnectAdenaWallet = async () => {};

	public getNotifications = async (address: string) => {
		return await this.accountRepository
			.getNotifications(address)
			.then(AccountHistoryMapper.fromResopnse)
			.catch(() => {
				throw new AccountError("WALLET_CONNECT_FAILED");
			});
	};

	public createNotification = async (transaction: TransactionModel) => {
		return await this.accountRepository.createNotification().then();
	};

	public updateNotificationStatus = async (
		txHash: string,
		status: StatusOptions,
	) => {
		return await this.accountRepository.updateNotificationStatus();
	};

	public deleteAllNotification = async () => {
		return this.accountRepository.deleteAllNotifications();
	};
}
