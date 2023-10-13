import EarnAddConfirm from "@components/earn-add/earn-add-confirm/EarnAddConfirm";
import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import useNavigate from "@hooks/common/use-navigate";
import { usePool } from "@hooks/pool/use-pool";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { TokenAmountInputModel } from "./use-token-amount-input";

export interface EarnAddLiquidityConfirmModalProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  currentPrice: string;
  priceRange: AddLiquidityPriceRage | null;
  slippage: number;
  swapFeeTier: SwapFeeTierType | null;
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
}: EarnAddLiquidityConfirmModalProps): SelectTokenModalModel => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const { createPool } = usePool();
  const navigator = useNavigate();

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
      currentPrice: currentPrice,
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
        symbol: "GNOT",
        decimals: 6,
        logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
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
    createPool({
      tokenA,
      tokenB,
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