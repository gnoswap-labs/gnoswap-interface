import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { ERROR_VALUE } from "@common/errors/adena";
import { GNS_TOKEN } from "@common/values/token-constant";
import { GNS_TOKEN_PATH } from "@constants/environment.constant";
import { SwapFeeTierInfoMap, SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { MAX_TICK, MIN_TICK } from "@constants/swap.constant";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import useRouter from "@hooks/common/use-custom-router";
import { useInvalidateQueries } from "@hooks/common/use-invalidate-queries";
import { useMessage } from "@hooks/common/use-message";
import { useReferral } from "@hooks/common/use-referral";
import { SelectPool } from "@hooks/pool/data/use-select-pool";
import { TokenAmountInputModel } from "@hooks/token/data/use-token-amount-input";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { useGetPoolCreationFee } from "@query/pools";
import { QUERY_KEY } from "@query/query-keys";
import { DexEvent } from "@repositories/common";
import {
  AddLiquidityFailedResponse,
  AddLiquiditySuccessResponse,
} from "@repositories/pool/response/add-liquidity-response";
import { CreatePoolFailedResponse, CreatePoolSuccessResponse } from "@repositories/pool/response/create-pool-response";
import { CommonState } from "@states/index";
import { subscriptFormat } from "@utils/number-utils";
import { makeDisplayPrice } from "@utils/pool-utils";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import { priceToNearTick } from "@utils/swap-utils";
import { formatDisplayTokenSymbol, makeDisplayTokenAmount } from "@utils/token-utils";

import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useAddress } from "@hooks/common/use-address";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import PoolAddConfirmModal from "@layouts/pool/pool-add/components/pool-add-confirm-modal/PoolAddConfirmModal";
import { delay } from "@utils/common";

export interface EarnAddLiquidityConfirmModalProps {
  tokenA: TokenModel | null;

  tokenB: TokenModel | null;

  tokenAAmountInput: TokenAmountInputModel;

  tokenBAmountInput: TokenAmountInputModel;

  selectPool: SelectPool;

  slippage: number;

  swapFeeTier: SwapFeeTierType | null;

  createPool: (params: {
    rpcProvider: GnoProvider | null;
    tokenAAmount: string;
    tokenBAmount: string;
    swapFeeTier: SwapFeeTierType;
    startPrice: string;
    minTick: number;
    maxTick: number;
    slippage: number;
  }) => Promise<WalletResponse<CreatePoolSuccessResponse | CreatePoolFailedResponse> | null>;

  addLiquidity: (params: {
    rpcProvider: GnoProvider | null;
    tokenAAmount: string;
    tokenBAmount: string;
    swapFeeTier: SwapFeeTierType;
    minTick: number;
    maxTick: number;
    slippage: number;
  }) => Promise<WalletResponse<AddLiquiditySuccessResponse | AddLiquidityFailedResponse> | null>;
}
export interface SelectTokenModalModel {
  openAddPositionModal: () => void;
}

export const usePoolAddLiquidityConfirmModal = ({
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
  const { t } = useTranslation();
  const { rpcProvider } = useGnoswapContext();
  const { broadcastLoading, broadcastRejected, broadcastSuccess, broadcastError } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();
  const { removeReferrerFromLocalStorage } = useReferral();
  const { currentChainId } = useWallet();

  const { getMessage } = useMessage();

  const router = useRouter();
  const { displayBalanceMap } = useTokenData();
  const { data: creationFee, refetch: refetchGetPoolCreationFee } = useGetPoolCreationFee();

  // Refetch functions
  const { address } = useAddress();
  const { updateBalances } = useTokenData();

  const [openedModal, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const { invalidateQueryKey } = useInvalidateQueries();

  const handleRefreshData = useCallback(async () => {
    const poolPath = selectPool.poolPath || "";

    invalidateQueryKey("AddLiquidity", [
      [QUERY_KEY.positions, currentChainId, address],
      [QUERY_KEY.pools],
      [QUERY_KEY.poolDetail, poolPath],
      [QUERY_KEY.poolPairBins],
    ]);
  }, [invalidateQueryKey, selectPool.poolPath, currentChainId, address]);

  const tokenAAmount = useMemo(() => {
    const depositRatio = selectPool.depositRatio;
    const compareTokenPath = selectPool.compareToken?.path;
    if (depositRatio === null || compareTokenPath === undefined) {
      return "0";
    }
    const ordered = compareTokenPath === tokenAAmountInput.token?.path;
    if (ordered && depositRatio === 0) {
      return "0";
    }
    if (!ordered && depositRatio === 100) {
      return "0";
    }
    return tokenAAmountInput.amount;
  }, [selectPool.depositRatio, selectPool.compareToken?.path, tokenAAmountInput.token?.path, tokenAAmountInput.amount]);

  const tokenBAmount = useMemo(() => {
    const depositRatio = selectPool.depositRatio;
    const compareTokenPath = selectPool.compareToken?.path;
    if (depositRatio === null || compareTokenPath === undefined) {
      return "0";
    }
    const ordered = compareTokenPath === tokenBAmountInput.token?.path;
    if (ordered && depositRatio === 0) {
      return "0";
    }
    if (!ordered && depositRatio === 100) {
      return "0";
    }
    return tokenBAmountInput.amount;
  }, [selectPool.depositRatio, selectPool.compareToken?.path, tokenBAmountInput.token?.path, tokenBAmountInput.amount]);

  const amountInfo = useMemo(() => {
    if (!tokenA || !tokenB || !swapFeeTier) {
      return null;
    }
    const tokenAUsdValue = tokenAAmount === "0" ? "-" : tokenAAmountInput.usdValue;
    const tokenBUsdValue = tokenBAmount === "0" ? "-" : tokenBAmountInput.usdValue;
    return {
      tokenA: {
        info: tokenA,
        amount: tokenAAmount,
        usdPrice: tokenAUsdValue,
      },
      tokenB: {
        info: tokenB,
        amount: tokenBAmount,
        usdPrice: tokenBUsdValue,
      },
      feeRate: SwapFeeTierInfoMap[swapFeeTier].rateStr,
    };
  }, [tokenA, tokenB, swapFeeTier, tokenAAmount, tokenAAmountInput.usdValue, tokenBAmount, tokenBAmountInput.usdValue]);

  const formatPriceDisplay = useCallback(
    (price: number, baseToken: TokenModel, quoteToken: TokenModel) => {
      if (price === null || BigNumber(Number(price)).isNaN() || !swapFeeTier) {
        return "-";
      }

      const { maxPrice } = SwapFeeTierMaxPriceRangeMap[swapFeeTier || "NONE"];

      const displayPrice = BigNumber(makeDisplayPrice(price, baseToken, quoteToken));
      const currentValue = displayPrice.toNumber();
      const maxPriceWithRatio = BigNumber(maxPrice)
        .shiftedBy(baseToken.decimals - quoteToken.decimals)
        .toNumber();

      if (currentValue < 1 && currentValue !== 0) {
        return subscriptFormat(displayPrice.toFixed());
      }

      if (currentValue / maxPriceWithRatio > 0.9) {
        return "∞";
      }

      return formatTokenExchangeRate(displayPrice.toFixed(), {
        maxSignificantDigits: 6,
        minLimit: 0.000001,
      });
    },
    [swapFeeTier],
  );

  const priceRangeInfo = useMemo(() => {
    if (!selectPool) {
      return null;
    }
    if (!tokenA || !tokenB || selectPool.currentPrice === null) {
      return null;
    }

    const tokenASymbol = formatDisplayTokenSymbol(
      selectPool.compareToken?.symbol === tokenA.symbol ? tokenA.symbol || "" : tokenB.symbol || "",
    );
    const tokenBSymbol = formatDisplayTokenSymbol(
      selectPool.compareToken?.symbol === tokenA.symbol ? tokenB.symbol || "" : tokenA.symbol || "",
    );
    const rawCurrentPrice = selectPool.currentPrice;
    const currentPrice = `${makeDisplayPrice(rawCurrentPrice, tokenA, tokenB)}`;
    if (selectPool.selectedFullRange) {
      return {
        currentPrice,
        inRange: true,
        minPrice: "0",
        maxPrice: "∞",
        priceLabelMin: `1 ${tokenASymbol} = 0 ${tokenBSymbol}`,
        priceLabelMax: `1 ${tokenASymbol} = ∞ ${tokenBSymbol}`,
        feeBoost: "x1",
        estimatedAPR: "N/A",
      };
    }

    const { minPrice } = SwapFeeTierMaxPriceRangeMap[selectPool.feeTier || "NONE"];
    let minPriceStr = "0.0000";
    let maxPriceStr = "0.0000";
    if (selectPool.minPrice && selectPool.minPrice > minPrice) {
      minPriceStr = formatPriceDisplay(selectPool.minPrice, tokenA, tokenB);
    }
    if (selectPool.maxPrice) {
      maxPriceStr = formatPriceDisplay(selectPool.maxPrice, tokenA, tokenB);
    }
    const feeBoost = selectPool.feeBoost === null ? "-" : `x${selectPool.feeBoost}`;

    let inRange = true;
    if (!selectPool.maxPrice || BigNumber(selectPool.maxPrice).isLessThan(rawCurrentPrice)) {
      inRange = false;
    }
    if (selectPool.minPrice === null || BigNumber(selectPool.minPrice).isGreaterThan(rawCurrentPrice)) {
      inRange = false;
    }

    return {
      currentPrice,
      inRange,
      minPrice: minPriceStr,
      maxPrice: maxPriceStr,
      priceLabelMin: `1 ${tokenASymbol} = ${minPriceStr} ${tokenBSymbol}`,
      priceLabelMax: `1 ${tokenASymbol} = ${maxPriceStr} ${tokenBSymbol}`,
      feeBoost,
      estimatedAPR: "N/A",
    };
  }, [formatPriceDisplay, selectPool, tokenA, tokenB]);

  const feeInfo = useMemo((): {
    token?: TokenModel;
    fee: string;
    errorMsg?: string;
  } => {
    return {
      token: GNS_TOKEN,
      fee: `${makeDisplayTokenAmount(GNS_TOKEN, creationFee || 0)}`,
      errorMsg: (() => {
        let totalGnsAmount = makeDisplayTokenAmount(GNS_TOKEN, creationFee || 0) || 0;
        const gnsBalance = displayBalanceMap[GNS_TOKEN.priceID] || 0;

        if (tokenA?.priceID === GNS_TOKEN_PATH) {
          totalGnsAmount += Number(tokenAAmount);
        }

        if (tokenB?.priceID === GNS_TOKEN_PATH) {
          totalGnsAmount += Number(tokenBAmount);
        }

        if (totalGnsAmount > gnsBalance) {
          return t("AddPosition:confirmAddModal.info.feeError.InsufBal");
        }
      })(),
    };
  }, [creationFee, displayBalanceMap, tokenA, tokenAAmount, tokenB, tokenBAmount, t]);

  const close = useCallback(() => {
    setOpenedModal(false);
    setModalContent(null);
  }, [setModalContent, setOpenedModal]);

  const moveToBack = useCallback(() => {
    close();
    const pathName = router.pathname;
    if (pathName === "/earn/add") {
      router.push("/earn");
    } else {
      router.push(router.asPath.replace("/add", ""));
    }
  }, [close, router]);

  const confirm = useCallback(() => {
    if (!tokenA || !tokenB || !swapFeeTier) {
      return;
    }

    const minTickMod = Math.abs(MIN_TICK) % selectPool.tickSpacing;
    const maxTickMod = Math.abs(MAX_TICK) % selectPool.tickSpacing;
    let minTick = MIN_TICK + minTickMod;
    let maxTick = MAX_TICK - maxTickMod;

    if (selectPool.minPrice != null && selectPool.maxPrice != null) {
      if (!selectPool.selectedFullRange) {
        minTick = priceToNearTick(selectPool.minPrice, selectPool.tickSpacing);
        maxTick = priceToNearTick(selectPool.maxPrice, selectPool.tickSpacing);
      }
    }

    broadcastLoading(
      getMessage(DexEvent.ADD, "pending", {
        tokenASymbol: tokenA?.symbol,
        tokenBSymbol: tokenB?.symbol,
        tokenAAmount: Number(tokenAAmount).toLocaleString("en-US", {
          maximumFractionDigits: tokenA.decimals,
        }),
        tokenBAmount: Number(tokenBAmount).toLocaleString("en-US", {
          maximumFractionDigits: tokenB.decimals,
        }),
      }),
    );

    const transaction = selectPool.isCreate
      ? createPool({
          rpcProvider,
          tokenAAmount,
          tokenBAmount,
          minTick,
          maxTick,
          slippage,
          startPrice: `${selectPool.startPrice || 1}`,
          swapFeeTier,
        })
      : addLiquidity({
          rpcProvider,
          tokenAAmount,
          tokenBAmount,
          minTick,
          maxTick,
          slippage,
          swapFeeTier,
        });
    transaction.then(result => {
      if (result) {
        if (result.code === 0 || result.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
          enqueueEvent({
            txHash: result.data?.hash,
            action: DexEvent.ADD,
            visibleEmitResult: true,
            checkStakePosition: true,
            formatData: response => {
              if (!response) {
                return {
                  tokenASymbol: tokenA?.symbol,
                  tokenBSymbol: tokenB?.symbol,
                  tokenAAmount: Number(tokenAAmount).toLocaleString("en-US", {
                    maximumFractionDigits: tokenA.decimals,
                  }),
                  tokenBAmount: Number(tokenBAmount).toLocaleString("en-US", {
                    maximumFractionDigits: tokenB.decimals,
                  }),
                };
              }

              return {
                tokenASymbol: tokenA?.symbol,
                tokenBSymbol: tokenB?.symbol,
                tokenAAmount: Number(tokenAAmount).toLocaleString("en-US", {
                  maximumFractionDigits: tokenA.decimals,
                }),
                tokenBAmount: Number(tokenBAmount).toLocaleString("en-US", {
                  maximumFractionDigits: tokenB.decimals,
                }),
              };
            },
            onUpdate: async () => {
              updateBalances();
            },
            onEmit: async () => {
              await delay(1000);
              handleRefreshData();
            },
            onSuccess: handleRefreshData,
          });
        }

        if (result.code === 0) {
          const resultData = result?.data as CreatePoolSuccessResponse;
          broadcastSuccess(
            getMessage(
              DexEvent.ADD,
              "success",
              {
                tokenASymbol: tokenA?.symbol || "",
                tokenBSymbol: tokenB?.symbol || "",
                tokenAAmount: Number(tokenAAmount).toLocaleString("en-US", {
                  maximumFractionDigits: tokenA.decimals,
                }),
                tokenBAmount: Number(tokenBAmount).toLocaleString("en-US", {
                  maximumFractionDigits: tokenB.decimals,
                }),
              },
              resultData.hash,
            ),
            moveToBack,
          );
          removeReferrerFromLocalStorage();
        } else if (
          result.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
        ) {
          broadcastRejected(
            getMessage(DexEvent.ADD, "error", {
              tokenASymbol: tokenA?.symbol,
              tokenBSymbol: tokenB?.symbol,
              tokenAAmount: Number(tokenAAmount).toLocaleString("en-US", {
                maximumFractionDigits: tokenA.decimals,
              }),
              tokenBAmount: Number(tokenBAmount).toLocaleString("en-US", {
                maximumFractionDigits: tokenB.decimals,
              }),
            }),
          );
        } else {
          broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
        }
      }
    });
  }, [
    tokenA,
    tokenB,
    swapFeeTier,
    selectPool.tickSpacing,
    selectPool.minPrice,
    selectPool.maxPrice,
    selectPool.isCreate,
    selectPool.selectedFullRange,
    selectPool.startPrice,
    addLiquidity,
    tokenAAmount,
    tokenBAmount,
    slippage,
    createPool,
    rpcProvider,
  ]);

  const openAddPositionModal = useCallback(() => {
    if (!amountInfo || !priceRangeInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(
      <PoolAddConfirmModal
        isPoolCreation={selectPool.isCreate}
        amountInfo={amountInfo}
        priceRangeInfo={priceRangeInfo}
        feeInfo={feeInfo}
        confirm={confirm}
        close={close}
      />,
    );
  }, [amountInfo, close, confirm, feeInfo, priceRangeInfo, setModalContent, setOpenedModal, selectPool.isCreate]);

  useEffect(() => {
    if (openedModal) {
      refetchGetPoolCreationFee();
    }
  }, [openedModal]);

  return {
    openAddPositionModal,
  };
};
