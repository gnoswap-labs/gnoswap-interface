export interface VolumeResponse {
  latest: string;
  fee: string;
  last7d: VolumeData[];
  last1m: VolumeData[];
  last1y: VolumeData[];
  all: VolumeData[];
}

interface VolumeData {
  date: string;
  volumeUsd: string;
}

export interface IVolumeResponse {
  allTime: string
  volume: VolumeResponse
  fee: Fee
}

export interface Fee {
  last7d: any
  last1m: any
  last1y: any
  all: any
}
