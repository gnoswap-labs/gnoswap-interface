import React from "react";

import { AccountModel } from "@models/account/account-model";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";

import EarnMyPositionsContent from "./earn-my-positions-content/EarnMyPositionsContent";
import EarnMyPositionsHeader from "./earn-my-positions-header/EarnMyPositionsHeader";

import { EarnMyPositionswrapper } from "./EarnMyPositions.styles";

export interface EarnMyPositionsProps {
  address?: string | null;
  addressName?: string;
  isOtherPosition: boolean;
  visiblePositions: boolean;
  positionLength: number;
  connected: boolean;
  fetched: boolean;
  loading: boolean;
  isError: boolean;
  positions: PoolPositionModel[];
  isSwitchNetwork: boolean;
  availableStake: boolean;
  connect: () => void;
  moveEarnAdd: () => void;
  movePoolDetail: (poolId: string, positionId: number) => void;
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
  tokenPrices: Record<string, TokenPriceModel>;
  highestApr: number;
}

const EarnMyPositions: React.FC<EarnMyPositionsProps> = ({
  address,
  addressName,
  isOtherPosition,
  visiblePositions,
  connected,
  availableStake,
  positionLength,
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
  tokenPrices,
  highestApr,
}) => (
  <EarnMyPositionswrapper>
    <EarnMyPositionsHeader
      address={address}
      addressName={addressName}
      isOtherPosition={isOtherPosition}
      visiblePositions={visiblePositions}
      positionLength={positionLength}
      connected={connected}
      availableStake={availableStake}
      moveEarnAdd={moveEarnAdd}
      moveEarnStake={moveEarnStake}
      isSwitchNetwork={isSwitchNetwork}
      isClosed={isClosed}
      handleChangeClosed={handleChangeClosed}
      positions={positions}
    />
    <EarnMyPositionsContent
      isOtherPosition={isOtherPosition}
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
      tokenPrices={tokenPrices}
      highestApr={highestApr}
    />
  </EarnMyPositionswrapper>
);

export default EarnMyPositions;
