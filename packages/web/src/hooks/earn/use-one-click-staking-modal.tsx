import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import OneClickStakingModalContainer from "@containers/one-click-staking-modal-container/OneClickStakingModalContainer";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { getCurrentPriceByRaw } from "@utils/swap-utils";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

export interface Props {
  openModal: () => void;
}

export interface OneClickConfirmModalProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  currentPrice: string;
  priceRange: AddLiquidityPriceRage | null;
  swapFeeTier: SwapFeeTierType | null;
}

export const useOneClickStakingModal = ({
  tokenA,
  tokenB,
  tokenAAmountInput,
  tokenBAmountInput,
  priceRange,
  currentPrice,
  swapFeeTier,
}: OneClickConfirmModalProps): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

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

  const openModal = useCallback(() => {
    if (!amountInfo || !priceRangeInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(<OneClickStakingModalContainer priceRangeInfo={priceRangeInfo} amountInfo={amountInfo} />);
  }, [setModalContent, setOpenedModal, priceRangeInfo, amountInfo]);

  return {
    openModal,
  };
};
