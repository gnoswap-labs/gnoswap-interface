import { GnoClientResnpose } from '@/api';

export class AbciQueryBankBalancesMapper {
  public static toBalances = (balacnes: string): GnoClientResnpose.Balacnes => {
    return {
      balances: balacnes,
    };
  };
}
