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
  isHiddenIndex?: boolean;
}

function isTokenInfo(info: CardListTokenInfo | CardListPoolInfo): info is CardListTokenInfo {
  if ("token" in info) {
    return true;
  }
  return false;
}

const CardList: React.FC<CardListProps> = ({ list, onClickItem, isHiddenIndex= false }) => {

  return (
    <CardListWrapper>
      {list.map((item, index) =>
        isTokenInfo(item) ? (
          <CardListTokenItem
            key={index}
            index={index + 1}
            item={item}
            onClickItem={onClickItem}
            isHiddenIndex={isHiddenIndex}
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
      leftSymbol: pool.tokenA.symbol,
      rightSymbol: pool.tokenA.symbol,
    };
  }, [item]);

  const visibleUp = useMemo(() => {
    return item.upDown === "up";
  }, [item.upDown]);

  const visibleDown = useMemo(() => {
    return item.upDown === "down";
  }, [item.upDown]);

  const onClick = useCallback(() => {
    onClickItem(`${item.pool.id}?path=${item.pool.path}`);
  }, [onClickItem, `${item.pool.id}?path=${item.pool.path}`]);

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
  isHiddenIndex?: boolean;
}

const CardListTokenItem: React.FC<CardListTokenItemProps> = ({ index, item, onClickItem, isHiddenIndex = false }) => {

  const visibleUp = useMemo(() => {
    return item.upDown === "up";
  }, [item.upDown]);

  const visibleDown = useMemo(() => {
    return item.upDown === "down";
  }, [item.upDown]);

  const onClick = useCallback(() => {
    onClickItem(item.token.symbol + `?tokenB=${item.token.path}&direction=EXACT_IN`);
  }, [onClickItem, item.token.symbol]);

  return (
    <ListItem onClick={onClick} upDown={item.upDown}>
      {!isHiddenIndex && <span className="index">{index}</span>}
      {item.token.logoURI ? <img src={item.token.logoURI} alt="logo" className="list-logo" /> : <div className="missing-logo">{item.token.symbol.slice(0,3)}</div>}
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