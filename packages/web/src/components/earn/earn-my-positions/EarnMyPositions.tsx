import EarnMyPositionsContent from "../earn-my-positions-content/EarnMyPositionsContent";
import EarnMyPositionsHeader from "../earn-my-positions-header/EarnMyPositionsHeader";
import { EarnMyPositionswrapper } from "./EarnMyPositions.styles";
import React from "react";
import { PoolPositionModel } from "@models/position/pool-position-model";

export interface EarnMyPositionsProps {
  connected: boolean;
  fetched: boolean;
  isError: boolean;
  positions: PoolPositionModel[];
  isSwitchNetwork: boolean;
  connect: () => void;
  moveEarnAdd: () => void;
  movePoolDetail: (poolId: string) => void;
  moveEarnStake: () => void;
  mobile: boolean;
  divRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  currentIndex: number;
  showPagination: boolean;
  showLoadMore: boolean;
  width: number;
  loadMore: boolean;
  onClickLoadMore?: () => void;
}

const EarnMyPositions: React.FC<EarnMyPositionsProps> = ({
  connected,
  connect,
  fetched,
  isError,
  positions,
  moveEarnAdd,
  movePoolDetail,
  moveEarnStake,
  isSwitchNetwork,
  mobile,
  onScroll,
  divRef,
  currentIndex,
  showPagination,
  showLoadMore,
  width,
  loadMore,
  onClickLoadMore,
}) => (
  <EarnMyPositionswrapper>
    <EarnMyPositionsHeader
      connected={connected}
      moveEarnAdd={moveEarnAdd}
      moveEarnStake={moveEarnStake}
      isSwitchNetwork={isSwitchNetwork}
    />
    <EarnMyPositionsContent
      connected={connected}
      connect={connect}
      fetched={fetched}
      isError={isError}
      positions={positions}
      movePoolDetail={movePoolDetail}
      isSwitchNetwork={isSwitchNetwork}
      mobile={mobile}
      divRef={divRef}
      onScroll={onScroll}
      currentIndex={currentIndex}
      showPagination={showPagination}
      showLoadMore={showLoadMore}
      width={width}
      loadMore={loadMore}
      onClickLoadMore={onClickLoadMore}
    />
  </EarnMyPositionswrapper>
);

export default EarnMyPositions;
