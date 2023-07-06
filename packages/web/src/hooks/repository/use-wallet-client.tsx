import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena-client";
import { RepositoryState } from "@states/index";
import { useAtom } from "jotai";

export const useWalletClient = (): WalletClient => {
  const [walletClient, setWalletClient] = useAtom(RepositoryState.walletClient);

  function getWalletClient() {
    if (!walletClient) {
      const createdWallectClient = AdenaClient.createAdenaClient();
      setWalletClient(createdWallectClient);
      return createdWallectClient;
    }
    return walletClient;
  }

  return getWalletClient();
};
