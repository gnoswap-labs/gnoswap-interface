import type { ContractOptions } from "@common/clients/wallet-client/adena/adena";
import { GNOT_TOKEN } from "@common/values/token-constant";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import BigNumber from "bignumber.js";
import { useCallback, useRef } from "react";

export const useWrap = () => {
  const { swapRouterRepository, tokenRepository } = useGnoswapContext();
  const { account, walletClient } = useWallet();
  const currentAddressRef = useRef(account?.address);
  currentAddressRef.current = account?.address;

  const sendUnwrap = useCallback(
    async (tokenAmount: string, options: ContractOptions) => {
      const rawTokenAmount = BigNumber(tokenAmount);
      if (!rawTokenAmount.isFinite() || rawTokenAmount.isLessThan(1000)) {
        return null;
      }

      const displayTokenAmount = rawTokenAmount.shiftedBy(-GNOT_TOKEN.decimals).toFixed();

      return swapRouterRepository.sendUnwrapToken({
        token: GNOT_TOKEN,
        tokenAmount: displayTokenAmount,
        ...options,
      });
    },
    [swapRouterRepository],
  );
  const unwrap = useCallback(
    (tokenAmount: string) => sendUnwrap(tokenAmount, { withNotification: false, isVisibleResult: false }),
    [sendUnwrap],
  );

  const unwrapAll = useCallback(
    async (txHash: string) => {
      const address = account?.address;
      if (!txHash || !address || currentAddressRef.current !== address) return null;

      const balances = await tokenRepository.getGrc20BalanceReceiptByAddress(address, txHash);
      if (currentAddressRef.current !== address || balances.accountBalanceApplied !== true) return null;

      const wugnotBalance = balances.data.find(balance => balance.path === WRAPPED_GNOT_PATH);
      if (!wugnotBalance) return null;
      // Notifications outlive this hook, so its render-updated ref alone cannot identify the signer.
      const signerAddress = await walletClient?.getAddress();
      if (signerAddress !== address || currentAddressRef.current !== address) return null;
      return sendUnwrap(wugnotBalance.amount, { withNotification: true, isVisibleResult: true });
    },
    [account?.address, tokenRepository, sendUnwrap, walletClient],
  );

  return {
    unwrap,
    unwrapAll,
  };
};
