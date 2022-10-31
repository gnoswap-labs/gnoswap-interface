export interface Balances {
  balances: Array<{
    amount: string;
    unit: string;
  }>;
}

const defaultValue = {
  balances: [
    {
      amount: '0.000000',
      unit: 'ugnot',
    },
  ],
};

export const BalancesDefault = {
  ...defaultValue,
};
