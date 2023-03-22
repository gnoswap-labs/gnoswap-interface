import Link from "next/link";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import { CardListWrapper, ListItem, StyledA, Title } from "./CardList.styles";

export enum UpDownType {
  "UP",
  "DOWN",
  "DEFAULT",
}

interface ListProps {
  logo: string | React.ReactNode;
  name: string;
  content: string;
  upDownType: UpDownType;
  notationValue: string;
}

interface CardListProps {
  title: string;
  list: Array<ListProps>;
}

const CardList: React.FC<CardListProps> = ({ title, list }) => {
  return (
    <CardListWrapper>
      <Title>{title}</Title>
      <ul>
        {list?.map((item, idx) => (
          <ListItem key={idx}>
            <Link href={"/"} legacyBehavior>
              <StyledA upDownType={item.upDownType}>
                <i>{idx + 1}</i>
                {typeof item.logo === "string" ? (
                  <img src={item.logo} alt="logo" />
                ) : (
                  item.logo
                )}
                <strong className="token-name">{item.name}</strong>
                <span className="list-content">{item.content}</span>
                {item.upDownType === UpDownType.UP && (
                  <IconTriangleArrowUp className="arrow-up" />
                )}
                {item.upDownType === UpDownType.DOWN && (
                  <IconTriangleArrowDown className="arrow-down" />
                )}
                <span className="notation-value">{item.notationValue}</span>
              </StyledA>
            </Link>
          </ListItem>
        ))}
      </ul>
    </CardListWrapper>
  );
};

export default CardList;
