export interface TvlResponse {
  latest: string;
  last_7d: TvlData[];
  last_1m: TvlData[];
  last_1y: TvlData[];
  all: TvlData[];
}

interface TvlData {
  date: string;
  price: string;
}
