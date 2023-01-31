import { AmountType } from "@/common/types/data-prop-types";

export interface CurrentWalletModel {
	address: string;
	username: string;
	connectedWalletName: string;
	amount: AmountType;
}
