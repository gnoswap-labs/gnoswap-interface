import React, { useMemo } from "react";
import CardList from "@components/home/card-list/CardList";
import {
  SkeletonItem,
  TrendingCardListwrapper,
} from "./TrendingCardList.styles";
import IconFlame from "@components/common/icons/IconFlame";
import { DEVICE_TYPE } from "@styles/media";
import { CardListTokenInfo } from "@models/common/card-list-item-info";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useTranslation } from "next-i18next";
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
  const { t } = useTranslation();
  const visible = useMemo(() => {
    return device !== DEVICE_TYPE.MOBILE;
  }, [device]);

  return visible ? (
    <TrendingCardListwrapper loading={loading}>
      {loading ? (
        <SkeletonItem tdWidth="100%">
          <span css={pulseSkeletonStyle({ w: "40%", h: 25 })} />
        </SkeletonItem>
      ) : (
        <div>
          <h2>
            <IconFlame className="icon-flame" />
            {t("Main:trending")}
          </h2>
        </div>
      )}
      {loading ? (
        <>
          <SkeletonItem tdWidth="100%">
            <span css={pulseSkeletonStyle({ w: "100%", h: 25 })} />
          </SkeletonItem>
          <SkeletonItem tdWidth="100%">
            <span css={pulseSkeletonStyle({ w: "100%", h: 25 })} />
          </SkeletonItem>
          <SkeletonItem tdWidth="100%">
            <span css={pulseSkeletonStyle({ w: "100%", h: 25 })} />
          </SkeletonItem>
        </>
      ) : (
        <CardList list={list} onClickItem={onClickItem} />
      )}
    </TrendingCardListwrapper>
  ) : null;
};

export default TrendingCardList;
