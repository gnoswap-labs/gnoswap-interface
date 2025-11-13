import React from "react";

import { AccountModel } from "@models/account/account-model";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";

import EarnMyPositionNoLiquidity from "./earn-my-positions-no-liquidity/EarnMyPositionNoLiquidity";
import EarnMyPositionsUnconnected from "./earn-my-positions-unconnected/EarnMyPositionsUnconnected";
import OtherPositionNoLiquidity from "./other-positions-no-liquidity/OtherPositionNoLiquidity";
import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";

export interface EarnMyPositionContentProps {
  address?: string | null;
  isOtherPosition: boolean;
  connected: boolean;
  fetched: boolean;
  loading: boolean;
  isError: boolean;
  positions: PoolPositionModel[];
  connect: () => void;
  movePoolDetail: (poolId: string, positionId: number) => void;
  isSwitchNetwork: boolean;
  mobile: boolean;
  divRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  currentIndex: number;
  maxDisplayCount: number;
  showPositionIndicator: boolean;
  showLoadMore: boolean;
  width: number;
  loadMore: boolean;
  onClickLoadMore?: () => void;
  themeKey: "dark" | "light";
  account: AccountModel | null;
  tokenPrices: Record<string, TokenPriceModel>;
  highestApr: number;
  currentPage?: number;
  totalPage?: number;
  movePage: (page: number) => void;
  limit?: number;
}

const EarnMyPositionsContent: React.FC<EarnMyPositionContentProps> = ({
  address,
  isOtherPosition,
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
  maxDisplayCount,
  showPositionIndicator,
  showLoadMore,
  width,
  loadMore,
  onClickLoadMore,
  themeKey,
  account,
  tokenPrices,
  highestApr,
  currentPage,
  totalPage,
  movePage,
  limit,
}) => {
  if (isOtherPosition && positions.length === 0 && !loading) {
    return <OtherPositionNoLiquidity account={account} />;
  }
  if ((!connected || isSwitchNetwork) && !loading && !isOtherPosition) {
    return <EarnMyPositionsUnconnected connect={connect} connected={connected} />;
  }

  if (connected && positions.length === 0 && !loading) {
    return <EarnMyPositionNoLiquidity highestApr={highestApr} account={account} />;
  }

  return (
    <MyPositionCardList
      address={address}
      positions={positions}
      isFetched={fetched}
      isLoading={loading}
      currentIndex={currentIndex}
      maxDisplayCount={maxDisplayCount}
      movePoolDetail={movePoolDetail}
      mobile={mobile}
      divRef={divRef}
      onScroll={onScroll}
      showPositionIndicator={showPositionIndicator}
      showLoadMore={showLoadMore}
      width={width}
      loadMore={loadMore}
      onClickLoadMore={onClickLoadMore}
      themeKey={themeKey}
      tokenPrices={tokenPrices}
      currentPage={currentPage}
      totalPage={totalPage}
      movePage={movePage}
      limit={limit}
    />
  );
};

export default EarnMyPositionsContent;
