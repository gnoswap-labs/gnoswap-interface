import React, { useMemo } from "react";
import CardList from "@components/home/card-list/CardList";
import {
  RecentlyAddedCardListWrapper,
  SkeletonItem,
} from "./RecentlyAddedCardList.styles";
import IconPieChart from "@components/common/icons/IconPieChart";
import { DEVICE_TYPE } from "@styles/media";
import { CardListKeyStats } from "@models/common/card-list-item-info";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import Link from "next/link";
import { cx } from "@emotion/css";
import { useTranslation } from "next-i18next";

interface RecentlyAddedCardListProps {
  list: Array<CardListKeyStats>;
  device: DEVICE_TYPE;
  onClickItem: (path: string) => void;
  loading: boolean;
}

const RecentlyAddedCardList: React.FC<RecentlyAddedCardListProps> = ({
  list,
  device,
  loading,
}) => {
  const { t } = useTranslation();

  const visible = useMemo(() => {
    return device !== DEVICE_TYPE.MOBILE;
  }, [device]);

  return visible ? (
    <RecentlyAddedCardListWrapper
      className={cx("loading", { "empty-status": loading })}
    >
      {loading ? (
        <SkeletonItem tdWidth="100%">
          <span css={pulseSkeletonStyle({ w: "40%", h: 25 })} />
        </SkeletonItem>
      ) : (
        <div className="header-wrapper">
          <h2>
            <IconPieChart className="icon-clock" />{" "}
            {t("Main:keyStatCard.title")}
          </h2>
          <Link href="/dashboard" className="link-to-dashboard">
            {t("Main:keyStatCard.toDashBoardBtnText")}
            <IconStrokeArrowRight />
          </Link>
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
        <CardList list={list} onClickItem={() => {}} />
      )}
    </RecentlyAddedCardListWrapper>
  ) : null;
};

export default RecentlyAddedCardList;
