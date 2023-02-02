import { StatusOptions } from "@/common/values/data-constant";
import { AmountType } from "@/common/types/data-prop-types";

export interface AccountInfoModel {
	status: StatusOptions;
	address: string;
	amount: AmountType;
}
