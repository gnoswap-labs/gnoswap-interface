import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import OneClickStakingModalContainer from "@containers/one-click-staking-modal-container/OneClickStakingModalContainer";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { numberToFormat } from "@utils/string-utils";
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
  priceRange: AddLiquidityPriceRage | null;
  swapFeeTier: SwapFeeTierType | null;
  selectPool: SelectPool | null;
}

export const useOneClickStakingModal = ({
  tokenA,
  tokenB,
  tokenAAmountInput,
  tokenBAmountInput,
  swapFeeTier,
  selectPool
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
    if (!selectPool) {
      return null;
    }
    return {
      currentPrice: selectPool.currentPrice ? numberToFormat(selectPool.currentPrice, 4) : "-",
      minPrice: numberToFormat(selectPool.minPrice || 0, 4),
      minPriceLable: numberToFormat(selectPool.minPrice || 0, 4),
      maxPrice: numberToFormat(selectPool.minPrice || 0, 4),
      maxPriceLable: numberToFormat(selectPool.maxPrice || 0, 4),
      feeBoost: selectPool.feeBoost ? numberToFormat(selectPool.feeBoost, 4) : "-",
      estimatedAPR: selectPool.estimatedAPR ? numberToFormat(selectPool.estimatedAPR, 4) : "N/A",
    };
  }, [selectPool]);

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
