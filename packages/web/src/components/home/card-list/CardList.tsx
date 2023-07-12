import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import { CardListWrapper, ListItem } from "./CardList.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { ValuesType } from "utility-types";

export const UP_DOWN_TYPE = {
  UP: "up",
  DOWN: "down",
  NONE: "none",
} as const;
export type UP_DOWN_TYPE = ValuesType<typeof UP_DOWN_TYPE>;

export interface ListProps {
  logo: string | [string, string];
  name: string;
  content: string;
  upDownType: UP_DOWN_TYPE;
  notationValue: string;
  onClick: () => void;
}
interface CardListProps {
  list: Array<ListProps>;
}

const CardList: React.FC<CardListProps> = ({ list }) => {
  return (
    <CardListWrapper>
      {list.map((item, idx) => (
        <ListItem key={idx} onClick={item.onClick} upDownType={item.upDownType}>
          <span className="index">{idx + 1}</span>
          {typeof item.logo === "string" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.logo} alt="logo" className="list-logo" />
          ) : (
            <DoubleLogo left={item.logo[0]} right={item.logo[1]} size={20} />
          )}
          <strong className="token-name">{item.name}</strong>
          <span className="list-content">{item.content}</span>
          {item.upDownType === UP_DOWN_TYPE.UP && (
            <IconTriangleArrowUp className="arrow-up" />
          )}
          {item.upDownType === UP_DOWN_TYPE.DOWN && (
            <IconTriangleArrowDown className="arrow-down" />
          )}
          <span className="notation-value">{item.notationValue}</span>
        </ListItem>
      ))}
    </CardListWrapper>
  );
};

export default CardList;
