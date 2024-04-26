export interface TvlResponse {
  latest: string;
  last7d: TvlData[];
  last1m: TvlData[];
  last1y: TvlData[];
  all: TvlData[];
}

interface TvlData {
  date: string;
  tvlUsd: string;
}
