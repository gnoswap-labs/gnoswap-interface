import { GNOT_TOKEN } from "@common/values/token-constant";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import BigNumber from "bignumber.js";
import { useCallback } from "react";

export const useWrap = () => {
  const { swapRouterRepository, tokenRepository } = useGnoswapContext();
  const { account } = useWallet();

  const fetchWugnotBalance = useCallback(async () => {
    const balances = await tokenRepository.getGrc20BalancesByAddress(account?.address || "");
    if (!balances) {
      return "0";
    }

    return balances.data.find(balance => balance.path === WRAPPED_GNOT_PATH)?.amount || "0";
  }, [tokenRepository, account?.address]);

  const unwrap = useCallback(
    async (tokenAmount: string) => {
      const rawTokenAmount = BigNumber(tokenAmount);
      if (rawTokenAmount.isNaN() || rawTokenAmount.isLessThan(1000)) {
        return null;
      }

      const displayTokenAmount = rawTokenAmount.shiftedBy(-GNOT_TOKEN.decimals).toFixed();

      return swapRouterRepository.sendUnwrapToken({
        token: GNOT_TOKEN,
        tokenAmount: displayTokenAmount,
      });
    },
    [swapRouterRepository],
  );

  const unwrapAll = useCallback(async () => {
    const wugnotBalance = await fetchWugnotBalance();

    return unwrap(wugnotBalance);
  }, [unwrap, fetchWugnotBalance]);

  return {
    fetchWugnotBalance,
    unwrap,
    unwrapAll,
  };
};
