import React, { useMemo } from "react";
import CardList from "@components/home/card-list/CardList";
import {
  RecentlyAddedCardListwrapper,
  SkeletonItem,
} from "./RecentlyAddedCardList.styles";
import IconClock from "@components/common/icons/IconClock";
import { DEVICE_TYPE } from "@styles/media";
import { CardListTokenInfo } from "@models/common/card-list-item-info";
import {
  SHAPE_TYPES,
  skeletonTrendingStyle,
} from "@constants/skeleton.constant";
interface RecentlyAddedCardListProps {
  list: Array<CardListTokenInfo>;
  device: DEVICE_TYPE;
  onClickItem: (path: string) => void;
  loading: boolean;
}

const RecentlyAddedCardList: React.FC<RecentlyAddedCardListProps> = ({
  list,
  device,
  onClickItem,
  loading,
}) => {
  const visible = useMemo(() => {
    return device !== DEVICE_TYPE.MOBILE;
  }, [device]);

  return visible ? (
    <RecentlyAddedCardListwrapper loading={loading}>
      {loading ? (
        <SkeletonItem tdWidth="100%">
          <span
            css={skeletonTrendingStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)}
          />
        </SkeletonItem>
      ) : (
        <div>
          <h2>
            <IconClock className="icon-clock" /> New Listings
          </h2>
        </div>
      )}
      {loading ? (
        <>
          <SkeletonItem tdWidth="100%">
            <span
              css={skeletonTrendingStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)}
            />
          </SkeletonItem>
          <SkeletonItem tdWidth="100%">
            <span
              css={skeletonTrendingStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)}
            />
          </SkeletonItem>
          <SkeletonItem tdWidth="100%">
            <span
              css={skeletonTrendingStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)}
            />
          </SkeletonItem>
        </>
      ) : (
        <CardList list={list} onClickItem={onClickItem} isHiddenIndex />
      )}
    </RecentlyAddedCardListwrapper>
  ) : null;
};

export default RecentlyAddedCardList;
