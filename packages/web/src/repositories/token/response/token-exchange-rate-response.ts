export interface TokenExchangeRateGraphResponse {
  latest: string;
  last7d: TokenExchangeRateData[];
  last1m: TokenExchangeRateData[];
  all: TokenExchangeRateData[];
  
}

export interface TokenExchangeRateData {
  time: string;
  value: number;
}
