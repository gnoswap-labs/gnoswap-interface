export interface PopularTokenModel {
	hits: number;
	total: number;
	tokens: Array<SummaryTokenType>;
}

interface SummaryTokenType {
	tokenId: string;
	name: string;
	symbol: string;
	change_24h: string;
	logoUrl: string; // token_id로 github에 매핑시킨 값으로 로고 이미지 url 값으로 사용 될 예정
}
