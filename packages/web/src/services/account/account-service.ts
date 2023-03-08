import { isErrorResponse } from "@/common/utils/validation-util";
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
			.catch(() => returnErrorResponse(new AccountError("CONNECT_TRY_AGAIN")));
	};

	public getAccountInfoByAddress = async (address: string) => {
		return await this.accountRepository
			.getAccountByAddress(address)
			.then(AccountInfoMapper.fromGnoResopnse)
			.catch(() => returnErrorResponse(new AccountError("CONNECT_TRY_AGAIN")));
	};

	public existsAdenaWalletCheck = () => {
		const existsCheck = this.accountRepository.existsWallet();
		return existsCheck
			? existsCheck
			: returnErrorResponse(new AccountError("NOT_EXIST_ADENA_WALLET"));
	};

	public connectAdenaWallet = async () => {
		const existsCheck = this.existsAdenaWalletCheck();
		if (isErrorResponse(existsCheck)) {
			return existsCheck;
		} else {
			return await this.accountRepository
				.addEstablishedSite()
				.then(AccountWalletMapper.fromResopnse)
				.catch(() =>
					returnErrorResponse(new AccountError("CONNECTION_REJECTED")),
				);
		}
	};

	public getNotifications = async (address: string) => {
		return await this.accountRepository
			.getNotificationsByAddress(address)
			.catch(() => returnErrorResponse(new AccountError("HAS_NOT_NOTI")));
	};

	public createNotification = async (
		address: string,
		transaction: TransactionModel,
	) => {
		return await this.accountRepository
			.createNotification(address, transaction)
			.catch(() => returnErrorResponse(new AccountError("FAILED_NOTI_CREATE")));
	};

	public updateNotificationStatus = async (
		address: string,
		txHash: string,
		status: StatusOptions,
	) => {
		return await this.accountRepository
			.updateNotificationStatus(address, txHash, status)
			.catch(() =>
				returnErrorResponse(new AccountError("FAILED_NOTI_STATUS_UPDATE")),
			);
	};

	public deleteAllNotification = async (address: string) => {
		return await this.accountRepository
			.deleteAllNotifications(address)
			.catch(() =>
				returnErrorResponse(new AccountError("FAILED_DILETE_ALL_NOTI")),
			);
	};
}
