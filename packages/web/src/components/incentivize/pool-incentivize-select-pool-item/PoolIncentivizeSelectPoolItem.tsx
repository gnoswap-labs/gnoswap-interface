import React, { useCallback, useMemo } from "react";
import { PoolIncentivizeSelectPoolItemWrapper, PoolIncentivizeSelectPoolItemDefaultWrapper } from "./PoolIncentivizeSelectPoolItem.styles";
import { PoolSelectItemModel } from "@models/pool/pool-select-item-model";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import Badge from "@components/common/badge/Badge";

export interface PoolIncentivizeSelectPoolItemProps {
  poolSelectItem: PoolSelectItemModel | null;
  visibleLiquidity: boolean;
  select: (poolId: string) => void;
}

const PoolIncentivizeSelectPoolItem: React.FC<PoolIncentivizeSelectPoolItemProps> = ({
  poolSelectItem,
  visibleLiquidity,
  select
}) => {
  const selected = poolSelectItem !== null;

  const doubloLogos = useMemo(() => {
    if (!selected) {
      return {
        left: "",
        right: ""
      };
    }
    const tokenPair = poolSelectItem?.tokenPair;
    return {
      left: tokenPair.token0.tokenLogo,
      right: tokenPair.token1.tokenLogo,
    };
  }, [poolSelectItem?.tokenPair, selected]);

  const tokenPairName = useMemo(() => {
    if (!poolSelectItem) {
      return "-";
    }
    const tokenPair = poolSelectItem.tokenPair;
    return `${tokenPair.token0.symbol}/${tokenPair.token1.symbol}`;
  }, [poolSelectItem]);

  const feeTier = useMemo(() => {
    if (!poolSelectItem) {
      return "-";
    }
    const feeRate = poolSelectItem.feeRate;
    return `${feeRate}%`;
  }, [poolSelectItem]);

  const liquidity = useMemo(() => {
    if (!poolSelectItem) {
      return "-";
    }
    return `$${poolSelectItem.liquidityAmount}`;
  }, [poolSelectItem]);

  const onClickItem = useCallback(() => {
    if (!poolSelectItem) {
      return;
    }
    select(poolSelectItem.poolId);
  }, [select, poolSelectItem]);

  if (!selected) {
    return (
      <PoolIncentivizeSelectPoolItemDefaultWrapper>
        Select
      </PoolIncentivizeSelectPoolItemDefaultWrapper>
    );
  }

  return (
    <PoolIncentivizeSelectPoolItemWrapper onClick={onClickItem}>
      <div className="main-content-wrapper">
        <DoubleLogo
          {...doubloLogos}
          size={24}
        />
        <span className="token-pair-name">{tokenPairName}</span>
        <Badge
          text={feeTier}
          type="lightDefault"
        />
      </div>

      {visibleLiquidity && (
        <div className="sub-content-wrapper">
          <span className="liquidity">{liquidity}</span>
        </div>
      )}
    </PoolIncentivizeSelectPoolItemWrapper>
  );
};

export default PoolIncentivizeSelectPoolItem;