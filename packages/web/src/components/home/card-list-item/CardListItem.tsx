import {
    CardListKeyStats,
    CardListPoolInfo,
    CardListTokenInfo,
} from "@models/common/card-list-item-info";
import React from "react";
import CardListKeyStatsItem from "./CardListKeyStatsItem";
import CardListPoolItem from "./CardListPoolItem";
import CardListTokenItem from "./CardListTokenItem";

interface CardListTokenItemProps {
  index: number;
  item: CardListTokenInfo | CardListPoolInfo | CardListKeyStats;
  onClickItem: (tokenPath: string) => void;
  isHiddenIndex?: boolean;
}


const CardListItem: React.FC<CardListTokenItemProps> = ({
  index,
  item,
  isHiddenIndex,
  onClickItem,
}) => {
  function isTokenCardItem(
    item: CardListTokenInfo | CardListPoolInfo | CardListKeyStats,
  ): item is CardListTokenInfo {
    return "token" in item;
  }

  function isKeyStatsCardItem(
    item: CardListTokenInfo | CardListPoolInfo | CardListKeyStats,
  ): item is CardListKeyStats {
    return "label" in item;
  }

  if (isTokenCardItem(item)) {
    return (
      <CardListTokenItem
        index={index}
        item={item}
        isHiddenIndex={isHiddenIndex}
        onClickItem={onClickItem}
      />
    );
  }

  if (isKeyStatsCardItem(item)) {
    return <CardListKeyStatsItem item={item} />;
  }

  return (
    <CardListPoolItem index={index} item={item} onClickItem={onClickItem} />
  );
};

export default CardListItem;
