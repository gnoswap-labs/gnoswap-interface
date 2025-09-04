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
