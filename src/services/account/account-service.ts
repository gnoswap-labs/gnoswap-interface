import { StorageClient } from "./../../common/clients/storage-client/storage-client";
import { AccountHistoryMapper } from "./../../models/account/mapper/account-history-mapper";
import { AccountInfoMapper } from "@/models/account/mapper/account-info-mapper";
import { AccountRepository } from "@/repositories/account";

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

	public getHistoryTxs = async (address: string) => {
		// const historyTxs = await this.accountRepository.getTransactions(address);
		// const aa = AccountHistoryMapper.fromResopnse(historyTxs);
	};

	public clearAllHistoryTxs = async () => {
		// return this.storageClient.remove("transaction-history");
	};
}
