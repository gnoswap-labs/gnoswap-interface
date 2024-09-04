export type DelegateeInfo = {
  name: string;
  logoUrl: string;
  address: string;
  votingPower: number;
  description: string;
  website: string;
};

export const nullDelegateeInfo: DelegateeInfo = {
  name: "",
  logoUrl: "",
  address: "",
  votingPower: 0,
  description: "",
  website: "",
};