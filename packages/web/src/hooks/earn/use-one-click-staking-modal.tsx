import { SwapFeeTierInfoMap, SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import OneClickStakingModalContainer from "@containers/one-click-staking-modal-container/OneClickStakingModalContainer";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { convertToKMB } from "@utils/stake-position-utils";
import { numberToFormat } from "@utils/string-utils";
import BigNumber from "bignumber.js";
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

  const priceLabel = useMemo(() => {
    if (!selectPool?.compareToken || !tokenA || !tokenB) {
      return "-";
    }
    const tokenASymbol = selectPool.compareToken?.symbol === tokenA?.symbol ? tokenA?.symbol : tokenB?.symbol;
    const tokenBSymbol = selectPool.compareToken?.symbol === tokenA?.symbol ? tokenB?.symbol : tokenA?.symbol;
    return `1 ${tokenASymbol} = ${tokenBSymbol}`;
  }, [selectPool?.compareToken, tokenA, tokenB]);

  const priceRangeInfo = useMemo(() => {
    if (!selectPool || selectPool.currentPrice === null) {
      return null;
    }
    const tokenASymbol = selectPool.compareToken?.symbol === tokenA?.symbol ? tokenA?.symbol : tokenB?.symbol;
    const tokenBSymbol = selectPool.compareToken?.symbol === tokenA?.symbol ? tokenB?.symbol : tokenA?.symbol;
    const currentPriceStr = `${selectPool.currentPrice}`;
    if (selectPool.currentPrice === null || selectPool.selectedFullRange) {
      return {
        currentPrice: currentPriceStr,
        inRange: true,
        minPrice: "0.0000",
        maxPrice: "∞",
        priceLabelMin: `1 ${tokenASymbol} = ∞ ${tokenBSymbol}`,
        priceLabelMax: `1 ${tokenASymbol} = ∞ ${tokenBSymbol}`,
        feeBoost: "x1",
        estimatedAPR: "N/A",
      };
    }

    const { minPrice, maxPrice } = SwapFeeTierMaxPriceRangeMap[selectPool.feeTier || "NONE"];
    let minPriceStr = "0.0000";
    let maxPriceStr = "0.0000";
    if (selectPool.minPrice && selectPool.minPrice > minPrice) {
      minPriceStr = numberToFormat(selectPool.minPrice, 4);
    }
    if (selectPool.maxPrice) {
      if (selectPool.maxPrice / maxPrice > 0.9) {
        maxPriceStr = "∞";
      } else {
        maxPriceStr = numberToFormat(selectPool.maxPrice, 4);
      }
    }
    const feeBoost = selectPool.feeBoost === null ? "-" : `x${selectPool.feeBoost}`;

    let inRange = true;
    if (!selectPool.maxPrice || BigNumber(selectPool.maxPrice).isLessThan(selectPool.currentPrice)) {
      inRange = false;
    }
    if (!selectPool.minPrice || BigNumber(selectPool.minPrice).isGreaterThan(selectPool.currentPrice)) {
      inRange = false;
    }
    return {
      currentPrice: currentPriceStr,
      inRange,
      minPrice: minPriceStr,
      maxPrice: maxPriceStr,
      priceLabelMin: `1 ${tokenASymbol} = ${minPriceStr === "∞" ? minPriceStr : convertToKMB(Number(minPriceStr).toFixed(4), 4)} ${tokenBSymbol}`,
      priceLabelMax: `1 ${tokenASymbol} = ${maxPriceStr === "∞" ? maxPriceStr : convertToKMB(Number(maxPriceStr).toFixed(4), 4)} ${tokenBSymbol}`,
      feeBoost,
      estimatedAPR: "N/A",
    };
  }, [priceLabel, selectPool]);

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
