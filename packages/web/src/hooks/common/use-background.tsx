import { useEffect } from "react";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useAtom } from "jotai";
import { CommonState, TokenState, WalletState } from "@states/index";
import { useTokenData } from "@hooks/token/use-token-data";

export const useBackground = () => {
  const { account, initSession, updateWalletEvents, connectAccount } = useWallet();
  const [walletClient] = useAtom(WalletState.client);
  const [, setBalances] = useAtom(TokenState.balances);
  const [sessionId] = useAtom(CommonState.sessionId);
  const { updateBalances, tokens } = useTokenData();
  
  useEffect(() => {
    if (walletClient) {
      return;
    }
    function initWalletBySession() {
      if (window?.adena?.version) {
        initSession();
      }
    }

    let count = 0;
    const interval = setInterval(() => {
      initWalletBySession();
      count += 1;
      if (count > 5 || walletClient || !sessionId) {
        clearInterval(interval);
      }
    }, 200);
    return () => { clearInterval(interval); };
  }, [walletClient]);

  useEffect(() => {
    if (walletClient) {
      if (account) {
        connectAccount();
      }
      updateWalletEvents(walletClient);
    }
  }, [walletClient, String(account)]);

  useEffect(() => {
    setBalances({});
    if (account?.address && account?.chainId) {
      updateBalances();
    }
  }, [account, tokens.toString()]);

};
