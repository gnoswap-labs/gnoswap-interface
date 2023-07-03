export interface PopularTokenModel {
  hits: number;
  total: number;
  tokens: Array<SummaryPopularTokenType>;
}

export interface SummaryPopularTokenType {
  tokenId: string;
  name: string;
  symbol: string;
  change24h: number;
}
