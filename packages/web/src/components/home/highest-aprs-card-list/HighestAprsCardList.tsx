import React, { useMemo } from "react";
import CardList from "@components/home/card-list/CardList";
import { HighestAprsCardListwrapper, LoadingWrapper, SkeletonItem } from "./HighestAprsCardList.styles";
import IconDiamond from "@components/common/icons/IconDiamond";
import { DEVICE_TYPE } from "@styles/media";
import { CardListPoolInfo } from "@models/common/card-list-item-info";
import { SHAPE_TYPES, skeletonTrendingStyle } from "@constants/skeleton.constant";

interface HighestAprsCardListProps {
  list: Array<CardListPoolInfo>;
  device: DEVICE_TYPE;
  onClickItem: (path: string) => void;
  loading: boolean;
}

const HighestAprsCardList: React.FC<HighestAprsCardListProps> = ({
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
    <HighestAprsCardListwrapper>
      <h2>
        <IconDiamond className="icon-diamond" /> Highest APRs
      </h2>
      <CardList list={list} onClickItem={onClickItem} />
    </HighestAprsCardListwrapper>
  ) : null;
};

export default HighestAprsCardList;
