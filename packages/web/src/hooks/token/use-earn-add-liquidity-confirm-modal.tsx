import EarnAddConfirm from "@components/earn-add/earn-add-confirm/EarnAddConfirm";
import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import useNavigate from "@hooks/common/use-navigate";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { TokenAmountInputModel } from "./use-token-amount-input";
import { getCurrentPriceByRaw } from "@utils/swap-utils";
import { useNotice } from "@hooks/common/use-notice";

export interface EarnAddLiquidityConfirmModalProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  currentPrice: string;
  priceRange: AddLiquidityPriceRage | null;
  slippage: number;
  swapFeeTier: SwapFeeTierType | null;
  createPool: (
    params: {
      tokenAAmount: string;
      tokenBAmount: string;
      swapFeeTier: SwapFeeTierType;
      startPrice: string;
      priceRange: AddLiquidityPriceRage;
      slippage: number;
    }
  ) => Promise<string | null>;
}
export interface SelectTokenModalModel {
  openModal: () => void;
}

export const useEarnAddLiquidityConfirmModal = ({
  tokenA,
  tokenB,
  tokenAAmountInput,
  tokenBAmountInput,
  priceRange,
  currentPrice,
  slippage,
  swapFeeTier,
  createPool,
}: EarnAddLiquidityConfirmModalProps): SelectTokenModalModel => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const navigator = useNavigate();
  const { setNotice } = useNotice();

  const amountInfo = useMemo(() => {
    if (!tokenA || !tokenB || !swapFeeTier) {
      return null;
    }
    return {
      tokenA: {
        info: tokenA,
        amount: tokenAAmountInput.amount,
        usdPrice: tokenAAmountInput.usdValue,
      },
      tokenB: {
        info: tokenB,
        amount: tokenBAmountInput.amount,
        usdPrice: tokenBAmountInput.usdValue,
      },
      feeRate: SwapFeeTierInfoMap[swapFeeTier].rateStr
    };
  }, [swapFeeTier, tokenA, tokenAAmountInput, tokenBAmountInput, tokenB]);


  const priceRangeInfo = useMemo(() => {
    if (!priceRange) {
      return null;
    }
    return {
      currentPrice: getCurrentPriceByRaw(currentPrice).toFixed(),
      minPrice: `${priceRange.range.minTick}`,
      minPriceLable: priceRange.range.minPrice,
      maxPrice: `${priceRange.range.maxTick}`,
      maxPriceLable: priceRange.range.maxPrice,
      feeBoost: "-",
      estimatedAPR: "N/A",
    };
  }, [currentPrice, priceRange]);

  const feeInfo = useMemo(() => {
    return {
      token: {
        path: "native",
        address: "",
        priceId: "GNOLAND",
        chainId: "dev",
        name: "Gno.land",
        symbol: "GNS",
        decimals: 6,
        logoURI: "/gnos.svg",
        createdAt: ""
      },
      fee: "0.000001"
    };
  }, []);

  const close = useCallback(() => {
    setOpenedModal(false);
    setModalContent(null);
  }, [setModalContent, setOpenedModal]);

  const moveEarn = useCallback(() => {
    close();
    navigator.push("/earn");
  }, [close, navigator]);

  const confirm = useCallback(() => {
    if (!tokenA || !tokenB || !priceRange || !swapFeeTier) {
      return;
    }
    setNotice(null, {timeout: 50000, type: "pending", closeable: true, id: Math.random() * 19999});
    createPool({
      tokenAAmount: tokenAAmountInput.amount,
      tokenBAmount: tokenBAmountInput.amount,
      priceRange,
      slippage,
      startPrice: currentPrice,
      swapFeeTier,
    }).then(result => result && moveEarn());
  }, [createPool, currentPrice, moveEarn, priceRange, slippage, swapFeeTier, tokenA, tokenAAmountInput.amount, tokenB, tokenBAmountInput.amount]);

  const openModal = useCallback(() => {
    if (!amountInfo || !priceRangeInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(
      <EarnAddConfirm
        amountInfo={amountInfo}
        priceRangeInfo={priceRangeInfo}
        feeInfo={feeInfo}
        confirm={confirm}
        close={close}
      />
    );
  }, [amountInfo, close, confirm, feeInfo, priceRangeInfo, setModalContent, setOpenedModal]);

  return {
    openModal
  };
};