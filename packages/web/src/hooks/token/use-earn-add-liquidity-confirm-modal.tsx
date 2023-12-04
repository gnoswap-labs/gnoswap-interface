import EarnAddConfirm from "@components/earn-add/earn-add-confirm/EarnAddConfirm";
import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import useNavigate from "@hooks/common/use-navigate";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { TokenAmountInputModel } from "./use-token-amount-input";
import { priceToNearTick } from "@utils/swap-utils";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { numberToFormat } from "@utils/string-utils";
import { MAX_TICK, MIN_TICK } from "@constants/swap.constant";

export interface EarnAddLiquidityConfirmModalProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  selectPool: SelectPool;
  slippage: number;
  swapFeeTier: SwapFeeTierType | null;
  createPool: (
    params: {
      tokenAAmount: string;
      tokenBAmount: string;
      swapFeeTier: SwapFeeTierType;
      startPrice: string;
      minTick: number;
      maxTick: number;
      slippage: number;
    }
  ) => Promise<string | null>;
  addLiquidity: (
    params: {
      tokenAAmount: string;
      tokenBAmount: string;
      swapFeeTier: SwapFeeTierType;
      minTick: number;
      maxTick: number;
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
  selectPool,
  slippage,
  swapFeeTier,
  createPool,
  addLiquidity,
}: EarnAddLiquidityConfirmModalProps): SelectTokenModalModel => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
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

  const priceLabel = useMemo(() => {
    if (!selectPool.compareToken || !tokenA || !tokenB) {
      return "-";
    }
    const tokenASymbol = selectPool.compareToken?.symbol === tokenA?.symbol ? tokenA?.symbol : tokenB?.symbol;
    const tokenBSymbol = selectPool.compareToken?.symbol === tokenA?.symbol ? tokenB?.symbol : tokenA?.symbol;
    return `${tokenASymbol} per ${tokenBSymbol}`;
  }, [selectPool.compareToken, tokenA, tokenB]);


  const priceRangeInfo = useMemo(() => {
    if (!selectPool) {
      return null;
    }
    const currentPrice = `${selectPool.currentPrice}`;
    if (selectPool.selectedFullRange) {
      return {
        currentPrice,
        minPrice: "0.0000",
        maxPrice: "∞",
        priceLabel,
        feeBoost: "x1",
        estimatedAPR: "N/A",
      };
    }

    const feeBoost = selectPool.feeBoost === null ? "-" : `x${selectPool.feeBoost}`;
    return {
      currentPrice,
      minPrice: numberToFormat(`${selectPool.minPrice || 0}`, 4),
      maxPrice: numberToFormat(`${selectPool.maxPrice || 0}`, 4),
      priceLabel,
      feeBoost,
      estimatedAPR: "N/A",
    };
  }, [priceLabel, selectPool]);

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
    if (!tokenA || !tokenB || !swapFeeTier) {
      return;
    }

    const minTickMod = Math.abs(MIN_TICK) % selectPool.tickSpacing;
    const maxTickMod = Math.abs(MAX_TICK) % selectPool.tickSpacing;
    let minTick = MIN_TICK + minTickMod;
    let maxTick = MAX_TICK - maxTickMod;

    if (selectPool.minPrice && selectPool.maxPrice) {
      if (!selectPool.selectedFullRange) {
        minTick = priceToNearTick(selectPool.minPrice, selectPool.tickSpacing);
        maxTick = priceToNearTick(selectPool.maxPrice, selectPool.tickSpacing);
      }
    }

    if (selectPool.isCreate) {
      createPool({
        tokenAAmount: tokenAAmountInput.amount,
        tokenBAmount: tokenBAmountInput.amount,
        minTick,
        maxTick,
        slippage,
        startPrice: `${selectPool.startPrice || 1}`,
        swapFeeTier,
      }).then(result => result && moveEarn());
      return;
    }

    addLiquidity({
      tokenAAmount: tokenAAmountInput.amount,
      tokenBAmount: tokenBAmountInput.amount,
      minTick,
      maxTick,
      slippage,
      swapFeeTier,
    }).then(result => result && moveEarn());
  }, [selectPool.isCreate, selectPool.maxPrice, selectPool.minPrice, selectPool.startPrice, selectPool.tickSpacing, slippage, swapFeeTier, tokenA, tokenAAmountInput.amount, tokenB, tokenBAmountInput.amount]);

  const openModal = useCallback(() => {
    if (!amountInfo || !priceRangeInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(
      <EarnAddConfirm
        isPoolCreation={selectPool.isCreate}
        amountInfo={amountInfo}
        priceRangeInfo={priceRangeInfo}
        feeInfo={feeInfo}
        confirm={confirm}
        close={close}
      />
    );
  }, [amountInfo, close, confirm, feeInfo, priceRangeInfo, setModalContent, setOpenedModal, selectPool.isCreate]);

  return {
    openModal
  };
};