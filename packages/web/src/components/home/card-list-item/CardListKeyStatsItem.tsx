import { CardListKeyStats } from "@models/common/card-list-item-info";
import { ListItem } from "./CardListItem.styles";

export interface CardListKeyStatsProps {
  item: CardListKeyStats;
}

const CardListKeyStatsItem: React.FC<CardListKeyStatsProps> = ({ item }) => {
  return (
    <ListItem upDown="none" disabled={true}>
      <span className="list-content key-stats-label">{item.label}</span>
      <span className="notation-value">{item.content}</span>
    </ListItem>
  );
};

export default CardListKeyStatsItem;
