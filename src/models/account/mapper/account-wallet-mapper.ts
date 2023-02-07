import { InjectResponse } from "@/common/clients/wallet-client/protocols";

export class AccountWalletMapper {
	public static fromResopnse(response: InjectResponse<any>): boolean {
		const isConnected = [0, 4001].includes(response.code);
		return isConnected;
	}
}
