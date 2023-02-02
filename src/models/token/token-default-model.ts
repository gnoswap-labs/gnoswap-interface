import { AmountType } from "@/common/types/data-prop-types";

export interface TokenDefaultModel {
	token_id: string;
	name: string;
	symbol: string;
	amount: AmountType;
}
