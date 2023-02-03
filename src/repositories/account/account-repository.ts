import {
	InjectResponse,
	InjectSendTransactionRequestParam,
} from "@/common/clients/wallet-client/protocols";
import { AccountInfoResponse, AccountTransactionResponse } from "./response";

export interface AccountRepository {
	getAccount: () => Promise<AccountInfoResponse>;

	getTransactions: (address: string) => Promise<AccountTransactionResponse>;

	existsWallet: () => boolean;

	addEstablishedSite: () => Promise<InjectResponse<any>>;

	sendTransaction: (
		request: InjectSendTransactionRequestParam,
	) => Promise<InjectResponse<any>>;
}
