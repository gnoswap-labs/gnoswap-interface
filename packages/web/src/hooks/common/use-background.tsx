import { useEffect } from "react";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useAtom } from "jotai";
import { TokenState, WalletState } from "@states/index";
import { useTokenData } from "@hooks/token/use-token-data";
import { useGetTokenPrices, useGetTokensList } from "@query/token";
import { TokenPriceModel } from "@models/token/token-price-model";

export const useBackground = () => {
  const { account, initSession, connectAccount, updateWalletEvents } = useWallet();
  const [walletClient] = useAtom(WalletState.client);
  const [, setTokens] = useAtom(TokenState.tokens);
  const [, setTokenPrices] = useAtom(TokenState.tokenPrices);
  const [, setBalances] = useAtom(TokenState.balances);
  const { updateBalances } = useTokenData();

  const { data: tokens } = useGetTokensList();
  const { data: tokenPrices } = useGetTokenPrices();

  useEffect(() => {
    if (tokens) {
      setTokens(tokens.tokens);
    }
  }, [tokens]);

  useEffect(() => {
    if (tokenPrices) {
      const priceMap = tokenPrices.prices.reduce<Record<string, TokenPriceModel>>((prev, current) => {
        prev[current.path] = current;
        return prev;
      }, {});
      setTokenPrices(priceMap);
    }
  }, [tokenPrices]);

  useEffect(() => {
    if (window.adena) {
      initSession();
    }
  }, [window.adena]);

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
