import { useAtom } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { useTokenData } from "@hooks/token/use-token-data";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import { TokenModel } from "@models/token/token-model";
import { useGetPoolList } from "@query/pools";
import PoolDetailData from "@repositories/pool/mock/pool-detail.json";
import { EarnState } from "@states/index";

import PoolIncentivize from "../../components/pool-incentivize/PoolIncentivize";
import { useIncentivizePoolModal } from "../../hooks/use-incentivize-pool-modal";

const tokenBalances: TokenBalanceInfo[] = [];
const periods = [90, 180, 365];

const PoolIncentivizeContainer: React.FC = () => {
  const { t } = useTranslation();

  const [period, setPeriod] = useAtom(EarnState.period);
  const [startDate, setStartDate] = useAtom(EarnState.date);
  const [, setDataModal] = useAtom(EarnState.dataModal);
  const [currentPool, setCurrentPool] = useAtom(EarnState.pool);

  const { connected, isSwitchNetwork } = useWallet();

  const [currentToken, setCurrentToken] = useState<TokenBalanceInfo | null>(
    null,
  );
  const [poolDetail, setPoolDetail] = useState<PoolDetailModel | null>(null);
  const [token, setToken] = useState<TokenModel | null>(null);
  const tokenAmountInput = useTokenAmountInput(token);
  const { updateTokenPrices } = useTokenData();
  const { data: pools = [] } = useGetPoolList({ enabled: false });
  const { getGnotPath } = useGnotToGnot();

  const { openModal: openConnectWalletModal } = useConnectWalletModal();

  useEffect(() => {
    setDataModal(tokenAmountInput);
  }, [tokenAmountInput.amount, token]);

  const { openModal } = useIncentivizePoolModal();

  useEffect(() => {
    updateTokenPrices();
    setCurrentPool(null);

    return () => {
      setPeriod(EarnState.period.init);
      setStartDate(EarnState.date.init);
    };
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
    [pools, setCurrentPool],
  );

  const selectToken = useCallback((path: string) => {
    const token = tokenBalances.find(token => token.path === path);
    if (token) {
      setCurrentToken(token);
    }
  }, []);

  const handleConfirmIncentivize = useCallback(() => {
    if (!connected) {
      openConnectWalletModal();
    } else {
      openModal();
    }
  }, [connected, openConnectWalletModal, openModal]);

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
      token={currentToken}
      tokens={tokenBalances}
      selectToken={selectToken}
      handleConfirmIncentivize={handleConfirmIncentivize}
      tokenAmountInput={tokenAmountInput}
      changeToken={changeToken}
      textBtn={textBtn}
      disableButton={disableButton}
      connected={connected}
    />
  );
};

export default PoolIncentivizeContainer;
