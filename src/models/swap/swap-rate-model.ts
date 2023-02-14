import { TokenDefaultModel } from "./../token/token-default-model";
import { BigNumber } from "bignumber.js";
import { ExactTypeOption } from "@/common/values/data-constant";
export interface SwapRateModel {
	token0: TokenDefaultModel;
	token1: TokenDefaultModel;
	type: ExactTypeOption;
}
