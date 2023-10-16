import React, { useCallback, useEffect, useMemo, useState } from "react";
import EarnAddLiquidity from "@components/earn-add/earn-add-liquidity/EarnAddLiquidity";
import { AddLiquiditySubmitType, PriceRangeType, SwapFeeTierType } from "@constants/option.constant";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";
import { PoolModel } from "@models/pool/pool-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import BigNumber from "bignumber.js";
import { useSlippage } from "@hooks/common/use-slippage";
import { useTokenData } from "@hooks/token/use-token-data";
import { useEarnAddLiquidityConfirmModal } from "@hooks/token/use-earn-add-liquidity-confirm-modal";

export interface AddLiquidityPriceRage {
  type: PriceRangeType;
  range: {
    minTick: number;
    minPrice: string;
    maxTick: number;
    maxPrice: string;
  }
  apr?: string;
}

export interface PoolTick {
  value: string;
  price: string;
  tick: number;
}

export interface PriceRangeSummary {
  depositRatio: string;
  feeBoost: string;
  estimatedApr: string;
}

export const SWAP_FEE_TIERS: SwapFeeTierType[] = [
  "FEE_100",
  "FEE_500",
  "FEE_3000",
  "FEE_10000",
];

const TEMP_CUSTOM_PRICE_RANGE: AddLiquidityPriceRage = {
  type: "Custom",
  range: {
    minTick: 6600,
    maxTick: 10200,
    minPrice: "1.2840093675402746",
    maxPrice: "2.1169206358924533",
  },
  apr: "0",
};

const EarnAddLiquidityContainer: React.FC = () => {
  const [tokenA, setTokenA] = useState<TokenModel | null>(null);
  const [tokenB, setTokenB] = useState<TokenModel | null>(null);
  const [startPrice] = useState<string>("130621891405341611593710811006");
  const tokenAAmountInput = useTokenAmountInput(tokenA);
  const tokenBAmountInput = useTokenAmountInput(tokenB);
  const [swapFeeTier, setSwapFeeTier] = useState<SwapFeeTierType | null>(null);
  const [priceRanges] = useState<AddLiquidityPriceRage[]>([TEMP_CUSTOM_PRICE_RANGE]);
  const [priceRange, setPriceRange] = useState<AddLiquidityPriceRage | null>(null);
  const [pools] = useState<PoolModel[]>([]);
  const { connected: connectedWallet, account, connectAdenaClient } = useWallet();
  const { slippage } = useSlippage();
  const { updateTokenPrices } = useTokenData();
  const { openModal: openConfirmModal } = useEarnAddLiquidityConfirmModal({
    tokenA,
    tokenB,
    tokenAAmountInput,
    tokenBAmountInput,
    currentPrice: startPrice,
    priceRange,
    slippage,
    swapFeeTier,
  });

  const priceRangeSummary: PriceRangeSummary = useMemo(() => {
    return {
      depositRatio: "-",
      feeBoost: "-",
      estimatedApr: "-",
    };
  }, []);

  const submitType: AddLiquiditySubmitType = useMemo(() => {
    if (!connectedWallet) {
      return "CONNECT_WALLET";
    }
    if (!swapFeeTier) {
      return "ENTER_AMOUNT";
    }
    if (!priceRange) {
      return "INVALID_RANGE";
    }
    if (!account?.balances || account.balances.length === 0) {
      return "INSUFFICIENT_BALANCE";
    }
    if (BigNumber(account.balances[0].amount).isLessThanOrEqualTo(1)) {
      return "INSUFFICIENT_BALANCE";
    }
    if (BigNumber(tokenAAmountInput.amount).isLessThanOrEqualTo(0)) {
      return "ENTER_AMOUNT";
    }
    if (BigNumber(tokenBAmountInput.amount).isLessThanOrEqualTo(0)) {
      return "ENTER_AMOUNT";
    }
    return "CREATE_POOL";
  }, [account?.balances, connectedWallet, priceRange, swapFeeTier, tokenAAmountInput.amount, tokenBAmountInput.amount]);

  useEffect(() => {
    updateTokenPrices();
  }, []);

  const selectSwapFeeTier = useCallback((swapFeeTier: SwapFeeTierType) => {
    setSwapFeeTier(swapFeeTier);
  }, []);

  const changePriceRange = useCallback((priceRange: AddLiquidityPriceRage) => {
    setPriceRange(priceRange);
  }, []);

  const changeTokenA = useCallback((token: TokenModel) => {
    setTokenA(token);
  }, []);

  const changeTokenB = useCallback((token: TokenModel) => {
    setTokenB(token);
  }, []);

  const submit = useCallback(() => {
    if (submitType === "CONNECT_WALLET") {
      connectAdenaClient();
      return;
    }
    if (submitType !== "CREATE_POOL") {
      return;
    }
    if (!tokenA || !tokenB || !priceRange || !swapFeeTier) {
      return;
    }
    openConfirmModal();
  }, [submitType, tokenA, tokenB, priceRange, swapFeeTier, openConfirmModal, connectAdenaClient]);

  return (
    <EarnAddLiquidity
      mode={"POOL"}
      tokenA={tokenA}
      tokenB={tokenB}
      tokenAInput={tokenAAmountInput}
      tokenBInput={tokenBAmountInput}
      changeTokenA={changeTokenA}
      changeTokenB={changeTokenB}
      feeTiers={SWAP_FEE_TIERS}
      feeTier={swapFeeTier}
      selectFeeTier={selectSwapFeeTier}
      priceRanges={priceRanges}
      priceRange={priceRange}
      priceRangeSummary={priceRangeSummary}
      changePriceRange={changePriceRange}
      ticks={[]}
      pools={pools}
      currentTick={null}
      submitType={submitType}
      submit={submit}
    />
  );
};

export default EarnAddLiquidityContainer;
