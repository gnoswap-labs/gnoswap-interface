import { GnoClientResnpose } from '@/gno-client';
import { AbciQueryAuthAccount } from '../response';

export class AbciQueryAuthAccountMapper {
  public static toAccount = (
    abciQueryAuthAccount: AbciQueryAuthAccount,
  ): GnoClientResnpose.Account => {
    return {
      address: abciQueryAuthAccount.BaseAccount.address,
      coins: abciQueryAuthAccount.BaseAccount.coins,
      publicKey: abciQueryAuthAccount.BaseAccount.public_key,
      accountNumber: abciQueryAuthAccount.BaseAccount.account_number,
      sequence: abciQueryAuthAccount.BaseAccount.sequence,
    };
  };
}
