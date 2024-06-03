import React, { useMemo } from "react";
import CardList from "@components/home/card-list/CardList";
import {
  HighestAprsCardListWrapper,
  SkeletonItem,
} from "./HighestAprsCardList.styles";
import IconDiamond from "@components/common/icons/IconDiamond";
import { DEVICE_TYPE } from "@styles/media";
import { CardListPoolInfo } from "@models/common/card-list-item-info";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { cx } from "@emotion/css";

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
  return visible ? (
    <HighestAprsCardListWrapper className={cx("loading", { "empty-status": loading })}>
      {loading ? (
        <SkeletonItem tdWidth="100%">
          <span css={pulseSkeletonStyle({ w: "40%", h: 25 })} />
        </SkeletonItem>
      ) : (
        <div>
          <h2>
            <IconDiamond className="icon-diamond" /> Highest APRs
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
    </HighestAprsCardListWrapper>
  ) : null;
};

export default HighestAprsCardList;
