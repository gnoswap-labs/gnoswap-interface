import { InjectResponse } from "@common/clients/wallet-client/protocols";
import { WalletAdenaModel } from "@models/account/wallet-adena-model";
export class AccountWalletMapper {
  public static fromResponse(response: InjectResponse<any>): WalletAdenaModel {
    const isConnected = [0, 4001].includes(response.code);
    return {
      code: response.code,
      isConnected,
    };
  }
}
