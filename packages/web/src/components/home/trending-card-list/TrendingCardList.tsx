import React, { useMemo } from "react";
import CardList from "@components/home/card-list/CardList";
import { LoadingWrapper, SkeletonItem, TrendingCardListwrapper } from "./TrendingCardList.styles";
import IconFlame from "@components/common/icons/IconFlame";
import { DEVICE_TYPE } from "@styles/media";
import { CardListTokenInfo } from "@models/common/card-list-item-info";
import { SHAPE_TYPES, skeletonTrendingStyle } from "@constants/skeleton.constant";
interface TrendingCardListProps {
  list: Array<CardListTokenInfo>;
  device: DEVICE_TYPE;
  onClickItem: (path: string) => void;
  loading: boolean;
}

const TrendingCardList: React.FC<TrendingCardListProps> = ({
  list,
  device,
  onClickItem,
  loading,
}) => {
  const visible = useMemo(() => {
    return device !== DEVICE_TYPE.MOBILE;
  }, [device]);


  if (loading) {
    return (<LoadingWrapper>
      <SkeletonItem tdWidth="100%">
        <span css={skeletonTrendingStyle("120px", SHAPE_TYPES.ROUNDED_SQUARE)} />
      </SkeletonItem>
      <SkeletonItem tdWidth="100%">
        <span css={skeletonTrendingStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)} />
      </SkeletonItem>
      <SkeletonItem tdWidth="100%">
        <span css={skeletonTrendingStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)} />
      </SkeletonItem>
      <SkeletonItem tdWidth="100%">
        <span css={skeletonTrendingStyle("100%", SHAPE_TYPES.ROUNDED_SQUARE)} />
      </SkeletonItem>
    </LoadingWrapper>);
  }

  return visible ? (
    <TrendingCardListwrapper>
      <h2>
        <IconFlame className="icon-flame" />
        Trending
      </h2>
      <CardList list={list} onClickItem={onClickItem} />
    </TrendingCardListwrapper>
  ) : null;
};

export default TrendingCardList;
