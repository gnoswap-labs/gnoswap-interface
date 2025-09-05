export interface VerifiedDelegateInfo {
  address: string;
  description: string;
  logoURL: string;
  name: string;
  votingPower: string;
  website: string;
}

export interface VerifiedDelegatesInfo {
  delegates: VerifiedDelegateInfo[];
}

// null objects
export const nullVerifiedDelegateInfo: VerifiedDelegateInfo = {
  address: "",
  description: "",
  logoURL: "",
  name: "",
  votingPower: "0",
  website: "",
};

export const nullVerifiedDelegatesInfo: VerifiedDelegatesInfo = {
  delegates: [],
};
