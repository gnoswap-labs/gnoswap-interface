export interface IVolumeResponse {
  allTimeFeeUsd: string;
  allTimeVolumeUsd: string;
  fee: Fee;
  fees24hUsd: string;
  volume: VolumeData;
  volume24hUsd: string;
}

interface VolumeDataItem {
  date: string;
  volumeUsd: string;
}

export interface Fee {
  last7d: string | number
  last30d: string | number
  last90d: string | number
  all: string | number
}

export interface VolumeData {
  last7d: VolumeDataItem[];
  last30d: VolumeDataItem[];
  last90d: VolumeDataItem[];
  all: VolumeDataItem[];
}
