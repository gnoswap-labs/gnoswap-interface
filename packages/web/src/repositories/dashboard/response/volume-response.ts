export interface VolumeResponse {
  latest: string;
  fee: string;
  last_7d: VolumeData[];
  last_1m: VolumeData[];
  last_1y: VolumeData[];
  all: VolumeData[];
}

interface VolumeData {
  date: string;
  price: string;
}
