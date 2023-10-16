import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import { CardListWrapper, ListItem } from "./CardList.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { CardListPoolInfo, CardListTokenInfo } from "@models/common/card-list-item-info";
import { useCallback, useMemo } from "react";
import { SwapFeeTierInfoMap } from "@constants/option.constant";

interface CardListProps {
  list: Array<CardListTokenInfo | CardListPoolInfo>;
  onClickItem: (id: string) => void;
}

function isTokenInfo(info: CardListTokenInfo | CardListPoolInfo): info is CardListTokenInfo {
  if ("token" in info) {
    return true;
  }
  return false;
}

const CardList: React.FC<CardListProps> = ({ list, onClickItem }) => {

  return (
    <CardListWrapper>
      {list.map((item, index) =>
        isTokenInfo(item) ? (
          <CardListTokenItem
            key={index}
            index={index + 1}
            item={item}
            onClickItem={onClickItem}
          />
        ) : (
          <CardListPoolItem
            key={index}
            index={index + 1}
            item={item}
            onClickItem={onClickItem} />
        ))}
    </CardListWrapper>
  );
};

export default CardList;

interface CardListPoolItemProps {
  index: number;
  item: CardListPoolInfo;
  onClickItem: (tokenPath: string) => void;
}

const CardListPoolItem: React.FC<CardListPoolItemProps> = ({ index, item, onClickItem }) => {

  const pairName = useMemo(() => {
    const pool = item.pool;
    return `${pool.tokenA.symbol}/${pool.tokenB.symbol}`;
  }, [item]);

  const poolFeeRate = useMemo(() => {
    const pool = item.pool;
    const feeRate =
      Object.values(SwapFeeTierInfoMap).find(model => `${model.fee}` === pool.fee)
        ?.rateStr || "-";
    return feeRate;
  }, [item]);

  const pairLogo = useMemo(() => {
    const pool = item.pool;
    return {
      left: pool.tokenA.logoURI,
      right: pool.tokenB.logoURI,
    };
  }, [item]);

  const visibleUp = useMemo(() => {
    return item.upDown === "up";
  }, [item.upDown]);

  const visibleDown = useMemo(() => {
    return item.upDown === "down";
  }, [item.upDown]);

  const onClick = useCallback(() => {
    onClickItem(item.pool.id);
  }, [onClickItem, item.pool.id]);

  return (
    <ListItem onClick={onClick} upDown={item.upDown}>
      <span className="index">{index}</span>
      <DoubleLogo {...pairLogo} size={20} />
      <strong className="token-name">{pairName}</strong>
      <span className="list-content">{poolFeeRate}</span>
      {visibleUp && (
        <IconTriangleArrowUp className="arrow-up" />
      )}
      {visibleDown && (
        <IconTriangleArrowDown className="arrow-down" />
      )}
      <span className="notation-value">{item.content}</span>
    </ListItem>
  );
};

interface CardListTokenItemProps {
  index: number;
  item: CardListTokenInfo;
  onClickItem: (tokenPath: string) => void;
}

const CardListTokenItem: React.FC<CardListTokenItemProps> = ({ index, item, onClickItem }) => {

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
      <span className="index">{index}</span>
      <img src={item.token.logoURI} alt="logo" className="list-logo" />
      <strong className="token-name">{item.token.name}</strong>
      <span className="list-content">{item.token.symbol}</span>
      {visibleUp && (
        <IconTriangleArrowUp className="arrow-up" />
      )}
      {visibleDown && (
        <IconTriangleArrowDown className="arrow-down" />
      )}
      <span className="notation-value">{item.content}</span>
    </ListItem>
  );
};