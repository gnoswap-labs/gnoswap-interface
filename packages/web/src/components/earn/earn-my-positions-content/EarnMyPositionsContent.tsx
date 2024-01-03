import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import EarnMyPositionNoLiquidity from "../earn-my-positions-no-liquidity/EarnMyPositionNoLiquidity";
import EarnMyPositionsUnconnected from "../earn-my-positions-unconnected/EarnMyPositionsUnconnected";
import React from "react";
import { PoolPositionModel } from "@models/position/pool-position-model";
export interface EarnMyPositionContentProps {
  connected: boolean;
  fetched: boolean;
  loading: boolean;
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
  loadMore: boolean;
  onClickLoadMore?: () => void;
  themeKey: "dark" | "light";
}

const EarnMyPositionsContent: React.FC<EarnMyPositionContentProps> = ({
  connected,
  fetched,
  loading,
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
  loadMore,
  onClickLoadMore,
  themeKey,
}) => {

  if ((!connected || isSwitchNetwork)) {
    return (
      <EarnMyPositionsUnconnected
        connect={connect}
        connected={connected}
      />
    );
  }

  if (connected && positions.length === 0 && !loading) {
    return <EarnMyPositionNoLiquidity />;
  }

  return (
    <MyPositionCardList
      positions={positions}
      isFetched={fetched}
      isLoading={loading}
      currentIndex={currentIndex}
      movePoolDetail={movePoolDetail}
      mobile={mobile}
      divRef={divRef}
      onScroll={onScroll}
      showPagination={showPagination}
      showLoadMore={showLoadMore}
      width={width}
      loadMore={loadMore}
      onClickLoadMore={onClickLoadMore}
      themeKey={themeKey}
    />
  );
};

export default EarnMyPositionsContent;
