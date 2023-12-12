import React, { useCallback, useEffect, useRef, useState } from "react";
import MyLiquidity from "@components/pool/my-liquidity/MyLiquidity";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";
import { usePositionData } from "@hooks/common/use-position-data";
import { PoolPositionModel } from "@models/position/pool-position-model";



const MyLiquidityContainer: React.FC = () => {
  const { breakpoint } = useWindowSize();
  const { connected: connectedWallet, isSwitchNetwork, account } = useWallet();
  const { getPositionsByPoolId } = usePositionData();
  const router = useRouter();
  const divRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [positions, setPositions] = useState<PoolPositionModel[]>([]);

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
    />
  );
};

export default MyLiquidityContainer;
