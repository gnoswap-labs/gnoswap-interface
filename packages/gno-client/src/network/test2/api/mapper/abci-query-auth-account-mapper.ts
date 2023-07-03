import { GnoClientResponse } from '../../../../api';
import { AbciQueryAuthAccount } from '../response';

export class AbciQueryAuthAccountMapper {
  public static toAccount = (
    abciQueryAuthAccount: AbciQueryAuthAccount | null,
  ): GnoClientResponse.Account => {
    if (abciQueryAuthAccount === null) {
      return GnoClientResponse.AccountInActive;
    }

    return {
      status: 'ACTIVE',
      address: abciQueryAuthAccount.BaseAccount.address,
      coins: abciQueryAuthAccount.BaseAccount.coins,
      publicKey: abciQueryAuthAccount.BaseAccount.public_key,
      accountNumber: abciQueryAuthAccount.BaseAccount.account_number,
      sequence: abciQueryAuthAccount.BaseAccount.sequence,
    };
  };
}
