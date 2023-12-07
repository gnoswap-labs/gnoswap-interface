import { useEffect } from "react";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useAtom } from "jotai";
import { TokenState, WalletState } from "@states/index";
import { useTokenData } from "@hooks/token/use-token-data";
import { useRouter } from "next/router";

export const useBackground = () => {
  const router = useRouter();
  const [walletClient] = useAtom(WalletState.client);
  const { account, initSession, connectAccount, updateWalletEvents } = useWallet();
  const [, setBalances] = useAtom(TokenState.balances);
  const { updateBalances } = useTokenData();

  useEffect(() => {
    initSession();
  }, [router.route]);

  useEffect(() => {
    if (walletClient) {
      connectAccount();
      updateWalletEvents(walletClient);
    }
  }, [walletClient]);

  useEffect(() => {
    setBalances({});
    if (account?.address && account?.chainId) {
      updateBalances();
    }
  }, [account?.address, account?.chainId]);

};
