import { AmountType } from "@/common/types/data-prop-types";
import { ActiveStatusOptions } from "@/common/values/data-constant";

export interface AccountInfoResponse {
	status: ActiveStatusOptions;
	address: string;
	coins: string;
	publicKey: {
		"@type": string;
		value: string;
	};
	accountNumber: number;
	sequence: number;
	chainId: string;
}
