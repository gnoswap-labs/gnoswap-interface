import React, { useMemo } from "react";
import CardList from "@components/home/card-list/CardList";
import {
  RecentlyAddedCardListwrapper,
  SkeletonItem,
} from "./RecentlyAddedCardList.styles";
import IconClock from "@components/common/icons/IconClock";
import { DEVICE_TYPE } from "@styles/media";
import { CardListTokenInfo } from "@models/common/card-list-item-info";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useTranslation } from "next-i18next";
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
  const { t } = useTranslation();
  const visible = useMemo(() => {
    return device !== DEVICE_TYPE.MOBILE;
  }, [device]);

  return visible ? (
    <RecentlyAddedCardListwrapper loading={loading}>
      {loading ? (
        <SkeletonItem tdWidth="100%">
          <span css={pulseSkeletonStyle({ w: "40%", h: 25 })} />
        </SkeletonItem>
      ) : (
        <div>
          <h2>
            <IconClock className="icon-clock" /> {t("Main:newListings")}
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
        <CardList list={list} onClickItem={onClickItem} isHiddenIndex />
      )}
    </RecentlyAddedCardListwrapper>
  ) : null;
};

export default RecentlyAddedCardList;
