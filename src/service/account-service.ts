import { AccountRepository } from "@/repositories/account";

export class AccountService {
	private accountRepository: AccountRepository;

	constructor(accountRepository: AccountRepository) {
		this.accountRepository = accountRepository;
	}

	public getAccountInfo = () => {
		return this.accountRepository.getAccount();
	};
}
