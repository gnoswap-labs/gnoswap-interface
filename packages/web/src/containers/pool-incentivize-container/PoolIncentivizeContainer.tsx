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
import { useGetPoolList } from "src/react-query/pools";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";

export const dummyDisclaimer =
  "This feature enables you to provide incentives as staking rewards for a specific liquidity pool. Before you proceed, ensure that you understand the mechanics of external incentives and acknowledge that you cannot withdraw the rewards once you complete this step.<br /><br />The incentives you add will be automatically distributed by the contract and may draw more liquidity providers.";

const tokenBalances: TokenBalanceInfo[] = [];
const periods = [90, 180, 365];

const PoolIncentivizeContainer: React.FC = () => {
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
      return "Wallet Login";
    }
    if (isSwitchNetwork) {
      return "Switch to Gnoland";
    }
    if (!currentPool) {
      return "Select Pool";
    }
    if (Number(tokenAmountInput.amount) === 0) {
      return "Enter Amount";
    }
    if (Number(tokenAmountInput.amount) < 0.000001) {
      return "Amount Too Low";
    }
    if (
      Number(tokenAmountInput.amount) >
      Number(tokenAmountInput.balance.replace(/,/g, ""))
    ) {
      return "Insufficient Balance";
    }
    return "Incentivize Pool";
  }, [connected, currentPool, tokenAmountInput, isSwitchNetwork]);

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
      disclaimer={dummyDisclaimer}
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
