export interface MyDelegate {
  address: string;
  name: string;
  logoURL: string;
  delegateAmount: string;
  delegatedAt: string;
}

export interface MyDelegatesInfo {
  delegates: MyDelegate[];
}

export const nullMyDelegatesInfo: MyDelegatesInfo = {
  delegates: [],
};

export interface MyUnDelegate {
  address: string;
  unDelegateAmount: string;
  logoURL: string;
  name: string;
  unlockTime: string;
  unDelegatedAt: string;
}

export interface MyUnDelegatesInfo {
  delegations: MyUnDelegate[];
}

export const nullMyUnDelegatesInfo: MyUnDelegatesInfo = {
  delegations: [],
};

export interface DelegationItemInfo2 {
  address: string;
  name: string;
  logoUrl: string;
  amount: number;
  updatedDate: string;

  // MyDelegate
  delegateAmount?: string;
  delegatedAt?: string;

  // MyUndelegate
  unDelegateAmount?: string;
  unlockTime?: string;
  unDelegatedAt?: string;
}

export const nullDelegationItemInfo2: DelegationItemInfo2 = {
  address: "0",
  name: "0",
  logoUrl: "0",
  amount: 0,
  updatedDate: "0",

  // MyDelegate
  delegateAmount: "0",
  delegatedAt: "",

  // MyUndelegate
  unDelegateAmount: "0",
  unlockTime: "",
  unDelegatedAt: "",
};
