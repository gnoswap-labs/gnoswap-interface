import {
	InjectResponse,
	InjectSendTransactionRequestParam,
} from "@/common/clients/wallet-client/protocols";
import { StatusOptions } from "@/common/values/data-constant";
import {
	AccountHistoryModel,
	TransactionModel,
} from "@/models/account/account-history-model";
import { AccountInfoResponse, AccountTransactionResponse } from "./response";

export interface AccountRepository {
	getAccount: () => Promise<AccountInfoResponse>;

	existsWallet: () => boolean;

	addEstablishedSite: () => Promise<InjectResponse<any>>;

	sendTransaction: (
		request: InjectSendTransactionRequestParam,
	) => Promise<InjectResponse<any>>;

	getNotificationsByAddress: (address: string) => Promise<AccountHistoryModel>;

	createNotification: (
		address: string,
		transaction: TransactionModel,
	) => Promise<boolean>;

	updateNotifiactionStatus: (
		address: string,
		txHash: string,
		status: StatusOptions,
	) => Promise<boolean>;

	deleteAllNotifications: (address: string) => Promise<boolean>;
}
