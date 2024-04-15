import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import { CardListWrapper, ListItem } from "./CardList.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import {
  CardListKeyStats,
  CardListPoolInfo,
  CardListTokenInfo,
} from "@models/common/card-list-item-info";
import { useCallback, useMemo } from "react";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

interface CardListProps {
  list: Array<CardListTokenInfo | CardListPoolInfo | CardListKeyStats>;
  onClickItem: (id: string) => void;
  isHiddenIndex?: boolean;
}

const enum CardType {
  "keyStats",
  "token",
  "pool",
}

function typeTokenInfo(
  info: CardListTokenInfo | CardListPoolInfo | CardListKeyStats,
): CardType {
  if ("token" in info) {
    return CardType.token;
  }
  if ("label" in info) {
    return CardType.keyStats;
  }
  return CardType.pool;
}

const CardList: React.FC<CardListProps> = ({
  list,
  onClickItem,
  isHiddenIndex = false,
}) => {
  return (
    <CardListWrapper>
      {list.map((item, index) =>
        typeTokenInfo(item) === CardType.token ? (
          <CardListTokenItem
            key={index}
            index={index + 1}
            item={item as CardListTokenInfo}
            onClickItem={onClickItem}
            isHiddenIndex={isHiddenIndex}
          />
        ) : typeTokenInfo(item) === CardType.keyStats ? (
          <CardListKeyStatsItem
            key={index}
            item={item as CardListKeyStats}
          />
        ) : (
          <CardListPoolItem
            key={index}
            index={index + 1}
            item={item as CardListPoolInfo}
            onClickItem={onClickItem}
          />
        ),
      )}
    </CardListWrapper>
  );
};

export default CardList;

interface CardListPoolItemProps {
  index: number;
  item: CardListPoolInfo;
  onClickItem: (tokenPath: string) => void;
}

const CardListPoolItem: React.FC<CardListPoolItemProps> = ({
  index,
  item,
  onClickItem,
}) => {
  const pairName = useMemo(() => {
    const pool = item.pool;
    return `${pool.tokenA.symbol}/${pool.tokenB.symbol}`;
  }, [item]);

  const poolFeeRate = useMemo(() => {
    const pool = item.pool;
    const feeRate =
      Object.values(SwapFeeTierInfoMap).find(
        model => `${model.fee}` === pool.fee,
      )?.rateStr || "-";
    return feeRate;
  }, [item]);

  const pairLogo = useMemo(() => {
    const pool = item.pool;
    return {
      left: pool.tokenA.logoURI,
      right: pool.tokenB.logoURI,
      leftSymbol: pool.tokenA.symbol,
      rightSymbol: pool.tokenB.symbol,
    };
  }, [item]);

  const visibleUp = useMemo(() => {
    return item.upDown === "up";
  }, [item.upDown]);

  const visibleDown = useMemo(() => {
    return item.upDown === "down";
  }, [item.upDown]);

  const onClick = useCallback(() => {
    onClickItem(`${item.pool.id}`);
  }, [onClickItem, `${item.pool.id}`]);

  return (
    <ListItem onClick={onClick} upDown={item.upDown}>
      <span className="index">{index}</span>
      <DoubleLogo {...pairLogo} size={20} />
      <strong className="token-name">{pairName}</strong>
      <span className="list-content">{poolFeeRate}</span>
      {visibleUp && <IconTriangleArrowUp className="arrow-up" />}
      {visibleDown && <IconTriangleArrowDown className="arrow-down" />}
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

interface CardListKeyStatsProps {
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
