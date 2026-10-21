import { GNOT_TOKEN } from "@common/values/token-constant";
import { WRAPPED_GNOT_PACKAGE_PATH, WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { evaluateExpressionToIntegerString, makeABCIParams } from "@utils/rpc-utils";
import BigNumber from "bignumber.js";
import { useCallback } from "react";

export const useWrap = () => {
  const { swapRouterRepository, tokenRepository, rpcProvider } = useGnoswapContext();
  const { account } = useWallet();

  const fetchWugnotBalance = useCallback(async () => {
    const balances = await tokenRepository.getGrc20BalancesByAddress(account?.address || "");
    return balances?.data.find(balance => balance.path === WRAPPED_GNOT_PATH);
  }, [tokenRepository, account?.address]);

  const fetchWugnotBalanceSnapshot = useCallback(
    async (height?: number) => {
      if (!rpcProvider || !account) return null;
      if (height !== undefined && (!Number.isSafeInteger(height) || height <= 0)) return null;

      const result = await rpcProvider.evaluateExpression(
        WRAPPED_GNOT_PACKAGE_PATH,
        makeABCIParams("BalanceOf", [account.address]),
        height,
      );
      return evaluateExpressionToIntegerString(result);
    },
    [rpcProvider, account],
  );

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
    const wugnotBalance = await fetchWugnotBalanceSnapshot();

    return unwrap(wugnotBalance || "0");
  }, [unwrap, fetchWugnotBalanceSnapshot]);

  return {
    fetchWugnotBalance,
    fetchWugnotBalanceSnapshot,
    unwrap,
    unwrapAll,
  };
};
