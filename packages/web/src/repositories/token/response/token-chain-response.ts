export interface IChainResponse {
    tvl: string;
    volume: string;
    totalVolume: string;
    trending: ITrending[];
    gainers: IGainer[];
    losers: ILoser[];
  }
  
  export interface ITrending {
    tokenPath: string;
    tokenPrice: string;
    tokenPriceChange: string;
  }
  
  export interface IGainer {
    tokenPath: string;
    tokenPrice: string;
    tokenPriceChange: string;
  }
  
  export interface ILoser {
    tokenPath: string;
    tokenPrice: string;
    tokenPriceChange: string;
  }
  