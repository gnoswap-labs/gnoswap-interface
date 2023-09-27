import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { AccountState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export const useAccount = () => {
  const [connected, setConnected] = useAtom(AccountState.connected);
  const [address, setAddress] = useAtom(AccountState.address);
  const { accountRepository } = useGnoswapContext();

  const connectWallet = useCallback(async () => {
    const existWallet = accountRepository.existsWallet();
    if (!existWallet) {
      return false;
    }

    const connected = await accountRepository.addEstablishedSite().then(result => {
      const connected =
        result.type === "CONNECTION_SUCCESS" ||
        result.type === "ALREADY_CONNECTED";
      return connected;
    }).catch(() => false);
    setConnected(connected);

    const accountInfo = await accountRepository.getAccount();
    if (accountInfo === null) {
      return false;
    }
    setAddress(accountInfo.address);
    return true;
  }, [accountRepository, setAddress, setConnected]);

  const disconnectWallet = () => {
    setAddress(null);
    setConnected(false);
  };

  return {
    address,
    connected,
    connectWallet,
    disconnectWallet,
  };
};
