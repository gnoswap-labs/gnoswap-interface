import React, { useMemo, useState, useEffect } from "react";
import CardList from "@components/home/card-list/CardList";
import {
  SkeletonItem,
  TrendingCardListwrapper,
} from "./TrendingCardList.styles";
import IconFlame from "@components/common/icons/IconFlame";
import { DEVICE_TYPE } from "@styles/media";
import { CardListTokenInfo } from "@models/common/card-list-item-info";
import {
  SHAPE_TYPES,
  skeletonTrendingStyle,
} from "@constants/skeleton.constant";
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
  const [loadingTitle, setLoadingTitle] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingTitle(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const visible = useMemo(() => {
    return device !== DEVICE_TYPE.MOBILE;
  }, [device]);

  return visible ? (
    <TrendingCardListwrapper>
      {loading && loadingTitle ? (
        <SkeletonItem tdWidth="100%">
          <span
            css={skeletonTrendingStyle("120px", SHAPE_TYPES.ROUNDED_SQUARE)}
          />
        </SkeletonItem>
      ) : (
        <div>
          <h2>
            <IconFlame className="icon-flame" />
            Trending
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
        <CardList list={list} onClickItem={onClickItem} />
      )}
    </TrendingCardListwrapper>
  ) : null;
};

export default TrendingCardList;
