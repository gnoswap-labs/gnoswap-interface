export interface IVolumeResponse {
  allTimeFeeUsd: string;
  allTimeVolumeUsd: string;
  fees24hUsd: string;
  volume: VolumeData;
  volume24hUsd: string;
}

interface VolumeDataItem {
  date: string;
  volumeUsd: string;
  feeUsd: string;
}

export interface VolumeData {
  last7d: VolumeDataItem[];
  last30d: VolumeDataItem[];
  last90d: VolumeDataItem[];
  all: VolumeDataItem[];
}
