export interface GetDelegateesResponse {
  delegatees: DelegateeItemResponse[];
}

export type DelegateeItemResponse = {
  name: string;
  logoUrl: string;
  address: string;
  votingPower: number;
  description: string;
  website: string;
};