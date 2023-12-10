import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import EarnMyPositionNoLiquidity from "../earn-my-positions-no-liquidity/EarnMyPositionNoLiquidity";
import EarnMyPositionsUnconnected from "../earn-my-positions-unconnected/EarnMyPositionsUnconnected";
import React from "react";
import { PoolPositionModel } from "@models/position/pool-position-model";
export interface EarnMyPositionContentProps {
  connected: boolean;
  fetched: boolean;
  isError: boolean;
  positions: PoolPositionModel[];
  connect: () => void;
  movePoolDetail: (poolId: string) => void;
  isSwitchNetwork: boolean;
  mobile: boolean;
  divRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  currentIndex: number;
  showPagination: boolean;
  showLoadMore: boolean;
  width: number;
}

const EarnMyPositionsContent: React.FC<EarnMyPositionContentProps> = ({
  connected,
  fetched,
  isError,
  positions,
  connect,
  movePoolDetail,
  isSwitchNetwork,
  mobile,
  divRef,
  onScroll,
  currentIndex,
  showPagination,
  showLoadMore,
  width,
}) => {
  if (!connected || isSwitchNetwork) {
    return (
      <EarnMyPositionsUnconnected
        connect={connect}
        connected={connected}
      />
    );
  }

  if (isError) {
    return <EarnMyPositionNoLiquidity />;
  }

  return (
    <MyPositionCardList
      positions={positions}
      isFetched={fetched}
      currentIndex={currentIndex}
      movePoolDetail={movePoolDetail}
      mobile={mobile}
      divRef={divRef}
      onScroll={onScroll}
      showPagination={showPagination}
      showLoadMore={showLoadMore}
      width={width}
    />
  );
};

export default EarnMyPositionsContent;
