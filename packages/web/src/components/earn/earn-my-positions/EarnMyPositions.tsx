import { PoolPosition } from "@containers/earn-my-position-container/EarnMyPositionContainer";
import EarnMyPositionsContent from "../earn-my-positions-content/EarnMyPositionsContent";
import EarnMyPositionsHeader from "../earn-my-positions-header/EarnMyPositionsHeader";
import { EarnMyPositionswrapper } from "./EarnMyPositions.styles";
import React from "react";

export interface EarnMyPositionsProps {
  connected: boolean;
  fetched: boolean;
  positions: PoolPosition[];
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
}

const EarnMyPositions: React.FC<EarnMyPositionsProps> = ({
  connected,
  connect,
  fetched,
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
    />
  </EarnMyPositionswrapper>
);

export default EarnMyPositions;
