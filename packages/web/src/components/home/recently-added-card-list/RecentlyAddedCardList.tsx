import React from "react";
import CardList, { type ListProps } from "@components/home/card-list/CardList";
import { RecentlyAddedCardListwrapper } from "./RecentlyAddedCardList.styles";
import IconClock from "@components/common/icons/IconClock";
import { DeviceSize } from "@styles/media";
interface RecentlyAddedCardListProps {
  list: Array<ListProps>;
  windowSize: number;
}

const RecentlyAddedCardList: React.FC<RecentlyAddedCardListProps> = ({
  list,
  windowSize,
}) => {
  return windowSize > DeviceSize.mobile ? (
    <RecentlyAddedCardListwrapper>
      <h2>
        <IconClock className="icon-clock" /> Recently Added
      </h2>
      <CardList list={list} />
    </RecentlyAddedCardListwrapper>
  ) : null;
};

export default RecentlyAddedCardList;
