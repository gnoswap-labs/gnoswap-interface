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
import useRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";

export const dummyDisclaimer =
  "This feature enables you to provide incentives as staking rewards for a specific liquidity pool. Before you proceed, ensure that you understand the mechanics of external incentives and acknowledge that you cannot withdraw the rewards once you complete this step.<br /><br />The incentives you add will be automatically distributed by the contract and may draw more liquidity providers.";

const tokenBalances: TokenBalanceInfo[] = [];
const periods = [90, 180, 365];

const PoolAddIncentivizeContainer: React.FC = () => {
  const [period, setPeriod] = useAtom(EarnState.period);
  const [startDate, setStartDate] = useAtom(EarnState.date);
  const [, setDataModal] = useAtom(EarnState.dataModal);
  const router = useRouter();
  const poolPath = router.query["pool-path"] as string;
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
    if (Number(tokenAmountInput.amount) > Number(tokenAmountInput.balance)) {
      return true;
    }
    return false;
  }, [connected, currentPool, tokenAmountInput]);

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
    if (Number(tokenAmountInput.amount) > Number(tokenAmountInput.balance)) {
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
      isDisabledSelect
    />
  );
};

export default PoolAddIncentivizeContainer;
