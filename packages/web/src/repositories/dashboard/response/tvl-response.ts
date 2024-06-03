export interface TvlResponse {
  latest: string;
  last7d: TvlData[];
  last30d: TvlData[];
  last90d: TvlData[];
  all: TvlData[];
}

interface TvlData {
  date: string;
  tvlUsd: string;
}
