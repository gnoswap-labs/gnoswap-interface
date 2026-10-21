import { GNOT_TOKEN } from "@common/values/token-constant";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import BigNumber from "bignumber.js";
import { useCallback, useRef } from "react";

export const useWrap = () => {
  const { swapRouterRepository, tokenRepository } = useGnoswapContext();
  const { account } = useWallet();
  const currentAddressRef = useRef(account?.address);
  currentAddressRef.current = account?.address;

  const unwrap = useCallback(
    async (tokenAmount: string) => {
      const rawTokenAmount = BigNumber(tokenAmount);
      if (!rawTokenAmount.isFinite() || rawTokenAmount.isLessThan(1000)) {
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

  const unwrapAll = useCallback(
    async (txHash: string) => {
      const address = account?.address;
      if (!txHash || !address || currentAddressRef.current !== address) return null;

      const balances = await tokenRepository.getGrc20BalancesByAddress(address, txHash);
      if (currentAddressRef.current !== address || balances.accountBalanceApplied !== true) return null;

      const wugnotBalance = balances.data.find(balance => balance.path === WRAPPED_GNOT_PATH);
      if (!wugnotBalance) return null;
      return unwrap(wugnotBalance.amount);
    },
    [account?.address, tokenRepository, unwrap],
  );

  return {
    unwrap,
    unwrapAll,
  };
};
