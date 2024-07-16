import { CardListPoolInfo } from "@models/common/card-list-item-info";
import { ListItem } from "./CardListItem.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import { useCallback, useMemo } from "react";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import IconStar from "@components/common/icons/IconStar";
import { formatRate } from "@utils/new-number-utils";

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
      {Number(item.apr) > 100 && <IconStar size={20} />}
      <span className="notation-value apr-value">{formatRate(item.apr)}</span>
    </ListItem>
  );
};

export default CardListPoolItem;
