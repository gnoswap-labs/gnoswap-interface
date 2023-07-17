import { ActiveStatusOptions } from "@common/values/data-constant";
import { AmountType } from "@common/types/data-prop-types";

export interface AccountInfoModel {
  status: ActiveStatusOptions;
  address: string;
  amount: AmountType;
}
