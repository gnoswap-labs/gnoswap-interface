export interface TokenBalance {
  path: string;
  amount: number;
}

export interface CommunityPoolBalancesInfo {
  balances: TokenBalance[];
}

// null objects
export const nullTokenBalance: TokenBalance = {
  path: "",
  amount: 0,
};

export const nullCommunityPoolBalancesInfo: CommunityPoolBalancesInfo = {
  balances: [],
};
