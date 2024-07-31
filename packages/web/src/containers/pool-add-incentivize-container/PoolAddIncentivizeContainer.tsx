import PoolIncentivize from "@components/incentivize/pool-incentivize/PoolIncentivize";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import PoolDetailData from "@repositories/pool/mock/pool-detail.json";
import { useIncentivizePoolModal } from "@hooks/incentivize/use-incentivize-pool-modal";
import { TokenModel } from "@models/token/token-model";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { useTokenData } from "@hooks/token/use-token-data";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGetPoolDetailByPath, useGetPoolList } from "@query/pools";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTranslation } from "react-i18next";

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
  const { updateTokenPrices } = useTokenData();
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

  const { openModal } = useIncentivizePoolModal();

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

  const disableButton = useMemo(() => {
    if (!connected) {
      return false;
    }
    if (isSwitchNetwork) {
      return false;
    }
    if (!currentPool) {
      return true;
    }
    if (Number(tokenAmountInput.amount) === 0) {
      return true;
    }
    if (Number(tokenAmountInput.amount) < 0.000001) {
      return true;
    }
    if (
      Number(tokenAmountInput.amount) >
      Number(tokenAmountInput.balance.replace(/,/g, ""))
    ) {
      return true;
    }
    return false;
  }, [connected, currentPool, tokenAmountInput, isSwitchNetwork]);

  const textBtn = useMemo(() => {
    if (!connected) {
      return t("IncentivizePool:submitBtn.walletLoginBtn");
    }
    if (isSwitchNetwork) {
      return t("IncentivizePool:submitBtn.switch");
    }
    if (!currentPool) {
      return t("IncentivizePool:submitBtn.selectPool");
    }
    if (Number(tokenAmountInput.amount) === 0) {
      return t("IncentivizePool:submitBtn.enterAmt");
    }
    if (Number(tokenAmountInput.amount) < 0.000001) {
      return t("IncentivizePool:submitBtn.amtTooLow");
    }
    if (
      Number(tokenAmountInput.amount) >
      Number(tokenAmountInput.balance.replace(/,/g, ""))
    ) {
      return t("IncentivizePool:submitBtn.insuffi");
    }
    return t("IncentivizePool:submitBtn.incentiPool");
  }, [
    connected,
    isSwitchNetwork,
    currentPool,
    tokenAmountInput.amount,
    tokenAmountInput.balance,
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
      dummyDisclaimer={t("IncentivizePool:disclaimer.desc", {
        context: "addPage",
      })}
      token={currentToken}
      tokens={tokenBalances}
      selectToken={selectToken}
      handleConfirmIncentivize={handleConfirmIncentivize}
      tokenAmountInput={tokenAmountInput}
      changeToken={changeToken}
      textBtn={textBtn}
      disableButton={disableButton}
      connected={connected}
      isDisabledSelect
    />
  );
};

export default PoolAddIncentivizeContainer;
