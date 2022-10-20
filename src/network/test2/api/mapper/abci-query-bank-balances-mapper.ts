import { GnoClientResnpose } from '@/gno-client';

export class AbciQueryBankBalancesMapper {
  public static toBalances = (balacnes: string): GnoClientResnpose.Balacnes => {
    return {
      balances: balacnes,
    };
  };
}
