import { AccountWalletMapper } from "@/models/account/mapper/account-wallet-mapper";
import { TransactionModel } from "@/models/account/account-history-model";
import { StatusOptions } from "@/common/values/data-constant";
import { AccountInfoMapper } from "@/models/account/mapper/account-info-mapper";
import { AccountRepository } from "@/repositories/account";
import { returnErrorResponse } from "@/common/utils/error-util";
import { AccountError } from "@/common/errors/account";

export class AccountService {
	private accountRepository: AccountRepository;

	constructor(accountRepository: AccountRepository) {
		this.accountRepository = accountRepository;
	}

	public getAccountInfo = async () => {
		return await this.accountRepository
			.getAccount()
			.then(AccountInfoMapper.fromResopnse)
			.catch(err => returnErrorResponse(new AccountError("CONNECT_TRY_AGAIN")));
	};

	public connectAdenaWallet = async () => {
		const existsWalletCheck = this.accountRepository.existsWallet();
		if (!existsWalletCheck)
			returnErrorResponse(new AccountError("NOT_EXIST_ADENA_WALLET"));
		return await this.accountRepository
			.addEstablishedSite()
			.then(AccountWalletMapper.fromResopnse)
			.catch(err =>
				returnErrorResponse(new AccountError("CONNECTION_REJECTED")),
			);
	};

	public getNotifications = async (address: string) => {
		return await this.accountRepository
			.getNotificationsByAddress(address)
			.catch(err => returnErrorResponse(new AccountError("HAS_NOT_NOTI")));
	};

	public createNotification = async (
		address: string,
		transaction: TransactionModel,
	) => {
		return await this.accountRepository
			.createNotification(address, transaction)
			.catch(err =>
				returnErrorResponse(new AccountError("FAILED_NOTI_CREATE")),
			);
	};

	public updateNotificationStatus = async (address: string, txHash: string) => {
		const changedStatus: StatusOptions = "SUCCESS";

		return await this.accountRepository
			.updateNotificationStatus(address, txHash, changedStatus)
			.catch(err =>
				returnErrorResponse(new AccountError("FAILED_NOTI_STATUS_UPDATE")),
			);
	};

	public deleteAllNotification = async (address: string) => {
		return await this.accountRepository
			.deleteAllNotifications(address)
			.catch(err =>
				returnErrorResponse(new AccountError("FAILED_DILETE_ALL_NOTI")),
			);
	};
}
