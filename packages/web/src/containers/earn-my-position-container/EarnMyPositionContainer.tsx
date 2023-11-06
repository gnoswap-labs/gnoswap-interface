import EarnMyPositions from "@components/earn/earn-my-positions/EarnMyPositions";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { ValuesType } from "utility-types";

export const POSITION_CONTENT_LABEL = {
  VALUE: "Value",
  APR: "APR",
  CURRENT_PRICE: "Current Price",
  MIN_PRICE: "Min Price",
  MAX_PRICE: "Max Price",
  STAR_TAG: "✨",
} as const;

export type POSITION_CONTENT_LABEL = ValuesType<typeof POSITION_CONTENT_LABEL>;

interface PositionToken {
  path: string;
  name: string;
  symbol: string;
  amount: {
    value: string;
    denom: string;
  };
  logoURI: string;
}

export interface PoolPosition {
  tokenPair: {
    tokenA: PositionToken,
    tokenB: PositionToken,
  };
  feeRate: string;
  stakeType: string;
  value: string;
  apr: string;
  inRange: boolean;
  currentPriceAmount: string;
  minPriceAmount: string;
  maxPriceAmount: string;
  rewards: {
    token: PositionToken;
    amount: {
      value: "18,500.18",
      denom: "gnot",
    };
  }[];
  currentTick?: number;
  minTick?: number;
  maxTick?: number;
  minLabel?: string;
  maxLabel?: string;
  ticks: string[];
}

interface EarnMyPositionContainerProps {
  loadMore?: boolean;
}

const EarnMyPositionContainer: React.FC<
  EarnMyPositionContainerProps
> = () => {
  const router = useRouter();
  const { connected, connectAdenaClient, isSwitchNetwork, switchNetwork } = useWallet();
  const { isFetchedPositions, myPositions, updatePositions } = usePoolData();

  const { openModal } = useConnectWalletModal();

  useEffect(() => {
    updatePositions();
  }, []);

  const connect = useCallback(() => {
    if (!connected) {
      openModal();
    } else {
      switchNetwork();
    }
  }, [connectAdenaClient, isSwitchNetwork, switchNetwork, openModal, connected]);

  const moveEarnAdd = useCallback(() => {
    router.push("/earn/add");
  }, [router]);

  const movePoolDetail = useCallback((id: string) => {
    router.push(`/earn/pool/${id}`);
  }, [router]);

  const moveEarnStake = useCallback(() => {
    router.push("/earn/stake");
  }, [router]);

  return (
    <EarnMyPositions
      connected={connected}
      connect={connect}
      fetched={isFetchedPositions}
      positions={myPositions}
      moveEarnAdd={moveEarnAdd}
      movePoolDetail={movePoolDetail}
      moveEarnStake={moveEarnStake}
      isSwitchNetwork={isSwitchNetwork}
    />
  );
};

export default EarnMyPositionContainer;
