import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { ListItem } from "./CardListItem.styles";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import { CardListTokenInfo } from "@models/common/card-list-item-info";
import { useCallback, useMemo } from "react";

interface CardListTokenItemProps {
  index: number;
  item: CardListTokenInfo;
  onClickItem: (tokenPath: string) => void;
  isHiddenIndex?: boolean;
}

const CardListTokenItem: React.FC<CardListTokenItemProps> = ({
  index,
  item,
  onClickItem,
  isHiddenIndex = false,
}) => {
  const visibleUp = useMemo(() => {
    return item.upDown === "up";
  }, [item.upDown]);

  const visibleDown = useMemo(() => {
    return item.upDown === "down";
  }, [item.upDown]);

  const onClick = useCallback(() => {
    onClickItem(item.token.path);
  }, [onClickItem, item.token.path]);

  return (
    <ListItem onClick={onClick} upDown={item.upDown}>
      {!isHiddenIndex && <span className="index">{index}</span>}
      <MissingLogo
        symbol={item.token.symbol}
        url={item.token.logoURI}
        className="list-logo"
        width={20}
        mobileWidth={20}
      />
      <strong className="token-name">{item.token.name}</strong>
      <span className="list-content">{item.token.symbol}</span>
      {visibleUp && <IconTriangleArrowUp className="arrow-up" />}
      {visibleDown && <IconTriangleArrowDown className="arrow-down" />}
      <span className="notation-value">{item.content}</span>
    </ListItem>
  );
};

export default CardListTokenItem;
