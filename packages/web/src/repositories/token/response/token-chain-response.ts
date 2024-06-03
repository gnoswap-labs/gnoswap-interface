export interface IChainResponse {
  trending: ITrending[];
  gainers: IGainer[];
  losers: ILoser[];
  stat: IChainStat;
}

export interface ITrending {
  tokenPath: string;
  tokenPrice: string;
  tokenPrice24hChange: string;
}

export interface IGainer {
  tokenPath: string;
  tokenPrice: string;
  tokenPrice24hChange: string;
}

export interface ILoser {
  tokenPath: string;
  tokenPrice: string;
  tokenPrice24hChange: string;
}

export interface IChainStat {
  allTimeVolumeUsd: string;
  tvlUsd: string;
  volume24hUsd: string;
}
