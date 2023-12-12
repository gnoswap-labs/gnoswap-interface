import React, { useCallback, useEffect, useRef, useState } from "react";
import MyLiquidity from "@components/pool/my-liquidity/MyLiquidity";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";
import { usePositionData } from "@hooks/common/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { usePosition } from "@hooks/common/use-position";



const MyLiquidityContainer: React.FC = () => {
  const router = useRouter();
  const divRef = useRef<HTMLDivElement | null>(null);
  const { breakpoint } = useWindowSize();
  const { connected: connectedWallet, isSwitchNetwork, account } = useWallet();
  const { getPositionsByPoolId } = usePositionData();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);
  const { claimAll } = usePosition(positions);

  useEffect(() => {
    const poolPath = router.query["pool-path"] as string;
    if (!poolPath) {
      return;
    }
    if (account?.address) {
      getPositionsByPoolId(poolPath).then(setPositions);
    }
  }, [account?.address, getPositionsByPoolId]);

  const handleClickAddPosition = useCallback(() => {
    router.push(`${router.asPath}/add`);
  }, [router]);

  const handleClickRemovePosition = useCallback(() => {
    router.push(`${router.asPath}/remove`);
  }, [router]);

  const handleScroll = () => {
    if (divRef.current) {
      const currentScrollX = divRef.current.scrollLeft;
      setCurrentIndex(Math.floor(currentScrollX / 240) + 1);
    }
  };

  const claimAllReward = useCallback(() => {
    claimAll();
  }, [claimAll]);

  return (
    <MyLiquidity
      positions={positions}
      breakpoint={breakpoint}
      connected={connectedWallet}
      isSwitchNetwork={isSwitchNetwork}
      handleClickAddPosition={handleClickAddPosition}
      handleClickRemovePosition={handleClickRemovePosition}
      divRef={divRef}
      onScroll={handleScroll}
      currentIndex={currentIndex}
      claimAll={claimAllReward}
    />
  );
};

export default MyLiquidityContainer;
