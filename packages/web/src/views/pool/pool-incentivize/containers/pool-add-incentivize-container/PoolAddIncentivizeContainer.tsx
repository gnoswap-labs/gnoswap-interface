import { useAtom } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN_PATH } from "@constants/environment.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import { TokenModel } from "@models/token/token-model";
import { useGetPoolDetailByPath, useGetPoolList } from "@query/pools";
import PoolDetailData from "@repositories/pool/mock/pool-detail.json";
import { EarnState } from "@states/index";

import { GNS_DEPOSIT_AMOUNT } from "../../components/pool-incentivize/incentive-creation-deposit/IncentiveCreationDeposit";
import PoolIncentivize from "../../components/pool-incentivize/PoolIncentivize";
import { useIncentivizePoolModal } from "../../hooks/use-incentivize-pool-modal";

const tokenBalances: TokenBalanceInfo[] = [];
const periods = [90, 180, 365];

const PoolAddIncentivizeContainer: React.FC = () => {
  const { t } = useTranslation();

  const [period, setPeriod] = useAtom(EarnState.period);
  const [startDate, setStartDate] = useAtom(EarnState.date);
  const [, setDataModal] = useAtom(EarnState.dataModal);
  const router = useCustomRouter();
  const poolPath = router.getPoolPath();
  const { getGnotPath } = useGnotToGnot();

  const { connected, connectAdenaClient, isSwitchNetwork } = useWallet();

  const [currentToken, setCurrentToken] = useState<TokenBalanceInfo | null>(
    null,
  );
  const [poolDetail, setPoolDetail] = useState<PoolDetailModel | null>(null);
  const [token, setToken] = useState<TokenModel | null>(null);
  const tokenAmountInput = useTokenAmountInput(token);
  const { updateTokenPrices, balances } = useTokenData();
  const { data: pools = [] } = useGetPoolList();
  const [currentPool, setCurrentPool] = useState(pools[0]);
  const { data: poolDetal } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
  });
  const [, setPool] = useAtom(EarnState.pool);

  useEffect(() => {
    const pool = pools.find(pool => pool.id === poolPath);
    if (pool) {
      const temp = {
        ...pool,
        tokenA: {
          ...pool.tokenA,
          name: getGnotPath(pool.tokenA).name,
          symbol: getGnotPath(pool.tokenA).symbol,
          logoURI: getGnotPath(pool.tokenA).logoURI,
        },
        tokenB: {
          ...pool.tokenB,
          name: getGnotPath(pool.tokenB).name,
          symbol: getGnotPath(pool.tokenB).symbol,
          logoURI: getGnotPath(pool.tokenB).logoURI,
        },
      };
      setCurrentPool(temp);
      setPool(temp);
    }
  }, [poolDetal, pools, poolPath, getGnotPath]);

  useEffect(() => {
    setDataModal(tokenAmountInput);
  }, [tokenAmountInput.amount, token]);

  const { openModal } = useIncentivizePoolModal({ poolPath: poolPath || "" });

  useEffect(() => {
    updateTokenPrices();
  }, []);

  const changeToken = useCallback((token: TokenModel) => {
    setToken(token);
  }, []);

  useEffect(() => {
    setPoolDetail(PoolDetailData.pool as PoolDetailModel);
  }, []);

  const selectPool = useCallback(
    (poolId: string) => {
      const pool = pools.find(pool => pool.id === poolId);
      if (pool) {
        setCurrentPool({
          ...pool,
          tokenA: {
            ...pool.tokenA,
            path: getGnotPath(pool.tokenA).path,
            symbol: getGnotPath(pool.tokenA).symbol,
            logoURI: getGnotPath(pool.tokenA).logoURI,
          },
          tokenB: {
            ...pool.tokenB,
            path: getGnotPath(pool.tokenB).path,
            symbol: getGnotPath(pool.tokenB).symbol,
            logoURI: getGnotPath(pool.tokenB).logoURI,
          },
        });
      }
    },
    [setCurrentPool],
  );

  const selectToken = useCallback((path: string) => {
    const token = tokenBalances.find(token => token.path === path);
    if (token) {
      setCurrentToken(token);
    }
  }, []);

  const handleConfirmIncentivize = useCallback(() => {
    if (!connected) {
      connectAdenaClient();
    } else {
      openModal();
    }
  }, [connected, connectAdenaClient, openModal]);

  const btnStatus: { text: string; disabled: boolean } = useMemo(() => {
    if (!connected) {
      return {
        text: t("IncentivizePool:submitBtn.walletLoginBtn"),
        disabled: true,
      };
    }
    if (isSwitchNetwork) {
      return {
        text: t("IncentivizePool:submitBtn.switch"),
        disabled: true,
      };
    }
    if (!currentPool) {
      return {
        text: t("IncentivizePool:submitBtn.selectPool"),
        disabled: true,
      };
    }
    if (Number(tokenAmountInput.amount) === 0) {
      return {
        text: t("IncentivizePool:submitBtn.enterAmt"),
        disabled: true,
      };
    }
    if (Number(tokenAmountInput.amount) < 0.000001) {
      return {
        text: t("IncentivizePool:submitBtn.amtTooLow"),
        disabled: true,
      };
    }
    if (
      Number(tokenAmountInput.amount) >
      Number(tokenAmountInput.balance.replace(/,/g, ""))
    ) {
      return {
        text: t("common:btn.insuffiBal"),
        disabled: true,
      };
    }
    if (
      (token?.path === GNS_TOKEN_PATH &&
        Number(tokenAmountInput.amount) + 1000 >
          Number(tokenAmountInput.balance.replace(/,/g, ""))) ||
      (token?.path !== GNS_TOKEN_PATH &&
        GNS_DEPOSIT_AMOUNT * 1_000_000 > (balances[GNS_TOKEN_PATH] || 0))
    )
      return {
        text: t("IncentivizePool:submitBtn.insuffiDep"),
        disabled: true,
      };
    return {
      text: t("IncentivizePool:submitBtn.incentiPool"),
      disabled: false,
    };
  }, [
    connected,
    isSwitchNetwork,
    currentPool,
    tokenAmountInput.amount,
    tokenAmountInput.balance,
    token?.path,
    balances,
    t,
  ]);

  return (
    <PoolIncentivize
      pools={pools}
      selectedPool={currentPool}
      selectPool={selectPool}
      startDate={startDate}
      setStartDate={setStartDate}
      periods={periods}
      period={period}
      setPeriod={setPeriod}
      details={poolDetail}
      token={currentToken}
      tokens={tokenBalances}
      selectToken={selectToken}
      handleConfirmIncentivize={handleConfirmIncentivize}
      tokenAmountInput={tokenAmountInput}
      changeToken={changeToken}
      textBtn={btnStatus.text}
      disableButton={btnStatus.disabled}
      connected={connected}
      isDisabledSelect
    />
  );
};

export default PoolAddIncentivizeContainer;
