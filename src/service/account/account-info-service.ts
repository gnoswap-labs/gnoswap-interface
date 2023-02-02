import { AccountInfoMapper } from "@/models/account/account-info-mapper";
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
}
