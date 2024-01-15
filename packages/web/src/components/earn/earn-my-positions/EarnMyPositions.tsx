import EarnMyPositionsContent from "../earn-my-positions-content/EarnMyPositionsContent";
import EarnMyPositionsHeader from "../earn-my-positions-header/EarnMyPositionsHeader";
import { EarnMyPositionswrapper } from "./EarnMyPositions.styles";
import React from "react";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { AccountModel } from "@models/account/account-model";

export interface EarnMyPositionsProps {
  connected: boolean;
  fetched: boolean;
  loading: boolean;
  isError: boolean;
  positions: PoolPositionModel[];
  isSwitchNetwork: boolean;
  availableStake: boolean;
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
  themeKey: "dark" | "light";
  account: AccountModel | null;
  isClosed: boolean;
  handleChangeClosed: () => void;
}

const EarnMyPositions: React.FC<EarnMyPositionsProps> = ({
  connected,
  availableStake,
  connect,
  fetched,
  loading,
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
  themeKey,
  account,
  isClosed,
  handleChangeClosed,
}) => (
  <EarnMyPositionswrapper>
    <EarnMyPositionsHeader
      connected={connected}
      availableStake={availableStake}
      moveEarnAdd={moveEarnAdd}
      moveEarnStake={moveEarnStake}
      isSwitchNetwork={isSwitchNetwork}
      isClosed={isClosed}
      handleChangeClosed={handleChangeClosed}
    />
    <EarnMyPositionsContent
      connected={connected}
      connect={connect}
      fetched={fetched}
      loading={loading}
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
      themeKey={themeKey}
      account={account}
    />
  </EarnMyPositionswrapper>
);

export default EarnMyPositions;
