import {
  CardListKeyStats,
  CardListPoolInfo,
  CardListTokenInfo,
} from "@models/common/card-list-item-info";
import CardListItem from "../card-list-item/CardListItem";
import { CardListWrapper } from "./CardList.styles";

interface CardListProps {
  list: Array<CardListTokenInfo | CardListPoolInfo | CardListKeyStats>;
  onClickItem: (id: string) => void;
  isHiddenIndex?: boolean;
}

const CardList: React.FC<CardListProps> = ({
  list,
  onClickItem,
  isHiddenIndex = false,
}) => {
  return (
    <CardListWrapper>
      {list.map((item, index) => (
        <CardListItem
          index={index + 1}
          key={index}
          item={item}
          isHiddenIndex={isHiddenIndex}
          onClickItem={onClickItem}
        />
      ))}
    </CardListWrapper>
  );
};

export default CardList;
