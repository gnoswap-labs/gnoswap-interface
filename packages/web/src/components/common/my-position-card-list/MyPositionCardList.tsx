import React, { useMemo } from "react";

import LoadMoreButton from "@components/common/load-more-button/LoadMoreButton";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { useWindowSize } from "@hooks/common/use-window-size";
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
  movePoolDetail: (poolId: string, positionId: number) => void;
  mobile: boolean;
  divRef?: React.RefObject<HTMLDivElement>;
  onScroll?: () => void;
  showPagination: boolean;
  showLoadMore: boolean;
  width: number;
  themeKey: "dark" | "light";
  tokenPrices: Record<string, TokenPriceModel>;
  currentPage?: number;
  totalPage?: number;
  movePage?: (page: number) => void;
}

const MyPositionCardList: React.FC<MyPositionCardListProps> = ({
  address,
  loadMore,
  isFetched,
  isLoading,
  onClickLoadMore,
  positions,
  currentIndex,
  movePoolDetail,
  mobile,
  divRef,
  onScroll,
  showPagination,
  width,
  themeKey,
  showLoadMore,
  tokenPrices,
  currentPage,
  totalPage,
  movePage,
}) => {
  const { width: windowWidth } = useWindowSize();
  const breakpoint = windowWidth >= 920 ? DEVICE_TYPE.WEB : DEVICE_TYPE.MOBILE;

  const hasPositions = positions.length > 0;
  const shouldShowSkeleton = isLoading || (!isFetched && !hasPositions);
  const shouldShowPositions = !isLoading && hasPositions;
  const shouldShowBlankCards = isFetched && !isLoading && hasPositions && positions.length < 4;
  const shouldShowLoadMoreButton = !mobile && !isLoading && showLoadMore && !!onClickLoadMore;
  const shouldShowPagination = showPagination && isFetched && hasPositions && !isLoading;
  const shouldShowPagePagination = totalPage && totalPage > 1 && movePage;

  const maxDisplayCount = useMemo(() => {
    return width <= 1180 && width >= 768 ? 3 : 4;
  }, [width]);

  const blankCardCount = useMemo(() => {
    if (!shouldShowBlankCards) return 0;
    return maxDisplayCount - positions.length;
  }, [shouldShowBlankCards, maxDisplayCount, positions.length]);

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
              key={idx}
              movePoolDetail={movePoolDetail}
              mobile={mobile}
              themeKey={themeKey}
            />
          ))}
        {shouldShowBlankCards &&
          Array(blankCardCount)
            .fill(1)
            .map((_, index) => <BlankPositionCard key={index} />)}
        {shouldShowSkeleton &&
          Array.from({ length: maxDisplayCount }).map((_, idx) => (
            <span key={idx} className="card-skeleton" css={pulseSkeletonStyle({ w: "100%", tone: "600" })} />
          ))}
      </HorizontalScrollWrapper>

      {shouldShowLoadMoreButton && <LoadMoreButton show={loadMore} onClick={onClickLoadMore} />}

      {shouldShowPagination && (
        <div className="box-indicator">
          <span className="current-page">{currentIndex}</span>
          <span>/</span>
          <span>{positions.length}</span>
        </div>
      )}

      {shouldShowPagePagination && (
        <Pagination
          currentPage={currentPage || 1}
          totalPage={totalPage}
          onPageChange={movePage}
          siblingCount={breakpoint !== DEVICE_TYPE.MOBILE ? 2 : 1}
        />
      )}
    </CardListWrapper>
  );
};

export default MyPositionCardList;
