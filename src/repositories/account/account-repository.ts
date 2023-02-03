import { AccountInfoResponse, AccountTransactionResponse } from "./response";

export interface AccountRepository {
	getAccount: () => Promise<AccountInfoResponse>;

	getTransactions: (address: string) => Promise<AccountTransactionResponse>;
}
