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
