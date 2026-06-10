import React, { useMemo } from "react";

import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { DEVICE_TYPE } from "@styles/media";

import MyPositionCard from "./my-position-card/MyPositionCard";

import { BlankPositionCard, CardListWrapper } from "./MyPositionCardList.styles";
import { HorizontalScrollWrapper } from "../scroll-wrapper";
import Pagination from "../pagination/Pagination";

interface MyPositionCardListProps {
  address?: string | null;
  loadMore: boolean;
  isFetched: boolean;
  isLoading: boolean;
  onClickLoadMore?: () => void;
  positions: PoolPositionModel[];
  currentIndex: number;
  maxDisplayCount: number;
  movePoolDetail: (poolId: string, positionId: number) => void;
  mobile: boolean;
  divRef?: React.RefObject<HTMLDivElement>;
  onScroll?: () => void;
  showPositionIndicator: boolean;
  showLoadMore: boolean;
  width: number;
  themeKey: "dark" | "light";
  tokenPrices: Record<string, TokenPriceModel>;
  currentPage?: number;
  totalPage?: number;
  movePage: (page: number) => void;
  limit?: number;
}

const MyPositionCardList: React.FC<MyPositionCardListProps> = ({
  address,
  loadMore,
  isFetched,
  isLoading,
  onClickLoadMore,
  positions,
  currentIndex,
  maxDisplayCount,
  movePoolDetail,
  mobile,
  divRef,
  onScroll,
  showPositionIndicator,
  width,
  themeKey,
  showLoadMore,
  tokenPrices,
  currentPage,
  totalPage,
  movePage,
  limit,
}) => {
  const breakpoint = width >= 920 ? DEVICE_TYPE.WEB : DEVICE_TYPE.MOBILE;

  const hasPositions = positions.length > 0;
  const shouldShowSkeleton = isLoading || (!isFetched && !hasPositions);
  const shouldShowPositions = hasPositions;
  const shouldShowLoadMoreButton = !mobile && !isLoading && showLoadMore && !!onClickLoadMore;
  const shouldShowPositionIndicator = showPositionIndicator && isFetched && hasPositions && !isLoading;
  const shouldShowPagination = Boolean(totalPage && totalPage > 1 && (mobile || !loadMore));
  const targetCount = shouldShowPagination && limit ? limit : maxDisplayCount;
  const shouldShowBlankCards = isFetched && !isLoading && hasPositions && positions.length < maxDisplayCount;

  const blankCardCount = useMemo(() => {
    if (!shouldShowBlankCards) return 0;
    return targetCount - positions.length;
  }, [shouldShowBlankCards, targetCount, positions.length]);

  return (
    <CardListWrapper $loading={isLoading}>
      <HorizontalScrollWrapper ref={divRef} onScroll={onScroll} loading={isLoading}>
        {shouldShowPositions &&
          positions.map((position, idx) => (
            <MyPositionCard
              address={address}
              tokenPrices={tokenPrices}
              currentIndex={idx}
              position={position}
              key={position.lpTokenId}
              movePoolDetail={movePoolDetail}
              mobile={mobile}
              themeKey={themeKey}
            />
          ))}
        {shouldShowBlankCards &&
          Array(blankCardCount)
            .fill(1)
            .map((_, index) => <BlankPositionCard key={index} />)}
        {shouldShowSkeleton && !hasPositions &&
          Array.from({ length: maxDisplayCount }).map((_, idx) => (
            <span key={idx} className="card-skeleton" css={pulseSkeletonStyle({ w: "100%", tone: "600" })} />
          ))}
      </HorizontalScrollWrapper>

      {shouldShowPagination && (
        <Pagination
          currentPage={currentPage || 1}
          totalPage={totalPage || 1}
          onPageChange={movePage}
          siblingCount={breakpoint !== DEVICE_TYPE.MOBILE ? 2 : 1}
        />
      )}

      {shouldShowLoadMoreButton && <LoadMoreButton show={loadMore} onClick={onClickLoadMore} />}

      {shouldShowPositionIndicator && (
        <div className="box-indicator">
          <span className="current-page">{currentIndex}</span>
          <span>/</span>
          <span>{positions.length}</span>
        </div>
      )}
    </CardListWrapper>
  );
};

export default MyPositionCardList;
