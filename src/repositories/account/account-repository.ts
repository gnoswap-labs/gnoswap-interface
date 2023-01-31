import { AccountInfoResposne, AccountTransactionResponse } from "./response";

export interface AccountRepository {
	getAccount: () => Promise<AccountInfoResposne>;

	getTransactions: (address: string) => Promise<AccountTransactionResponse>;
}
