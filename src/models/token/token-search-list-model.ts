import { TokenDefaultModel } from "./token-default-model";

export interface TokenSearchListModel {
	items: Array<TokenSearchItemType>;
}

export interface TokenSearchItemType {
	searchType: string;
	changeRate: number;
	token: TokenDefaultModel;
}
