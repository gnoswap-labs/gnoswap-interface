import React, { useMemo } from "react";
import CardList from "@components/home/card-list/CardList";
import { RecentlyAddedCardListwrapper } from "./RecentlyAddedCardList.styles";
import IconClock from "@components/common/icons/IconClock";
import { DEVICE_TYPE } from "@styles/media";
import { CardListTokenInfo } from "@models/common/card-list-item-info";
interface RecentlyAddedCardListProps {
  list: Array<CardListTokenInfo>;
  device: DEVICE_TYPE;
  onClickItem: (path: string) => void;
}

const RecentlyAddedCardList: React.FC<RecentlyAddedCardListProps> = ({
  list,
  device,
  onClickItem,
}) => {
  const visible = useMemo(() => {
    return device !== DEVICE_TYPE.MOBILE;
  }, [device]);

  return visible ? (
    <RecentlyAddedCardListwrapper>
      <h2>
        <IconClock className="icon-clock" /> New Listings
      </h2>
      <CardList list={list} onClickItem={onClickItem} isHiddenIndex/>
    </RecentlyAddedCardListwrapper>
  ) : null;
};

export default RecentlyAddedCardList;
