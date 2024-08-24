import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { PoolSelectItemInfo } from "@models/pool/info/pool-select-item-info";
import { convertToKMB } from "@utils/stake-position-utils";

import {
  PoolIncentivizeSelectPoolItemDefaultWrapper,
  PoolIncentivizeSelectPoolItemWrapper,
} from "./PoolIncentivizeSelectPoolItem.styles";

export interface PoolIncentivizeSelectPoolItemProps {
  poolSelectItem: PoolSelectItemInfo | null;
  visibleLiquidity: boolean;
  select: (poolId: string) => void;
}

const PoolIncentivizeSelectPoolItem: React.FC<
  PoolIncentivizeSelectPoolItemProps
> = ({ poolSelectItem, visibleLiquidity, select }) => {
  const { t } = useTranslation();

  const selected = poolSelectItem !== null;

  const doubleLogos = useMemo(() => {
    if (!selected) {
      return {
        left: "",
        right: "",
      };
    }
    return {
      left: poolSelectItem.tokenA.logoURI,
      right: poolSelectItem.tokenB.logoURI,
      leftSymbol: poolSelectItem.tokenA.symbol,
      rightSymbol: poolSelectItem.tokenB.symbol,
    };
  }, [poolSelectItem, selected]);

  const tokenPairName = useMemo(() => {
    if (!poolSelectItem) {
      return "-";
    }
    return `${poolSelectItem.tokenA.symbol}/${poolSelectItem.tokenB.symbol}`;
  }, [poolSelectItem]);

  const liquidity = useMemo(() => {
    if (!poolSelectItem || !poolSelectItem.liquidityAmount) {
      return "-";
    }
    return `$${convertToKMB(poolSelectItem.liquidityAmount)}`;
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
        {t("common:select")}
      </PoolIncentivizeSelectPoolItemDefaultWrapper>
    );
  }

  return (
    <PoolIncentivizeSelectPoolItemWrapper
      visibleLiquidity={visibleLiquidity}
      onClick={onClickItem}
    >
      <div className="main-content-wrapper">
        <DoubleLogo {...doubleLogos} size={24} />
        <span className="token-pair-name">{tokenPairName}</span>
        <Badge text={poolSelectItem.feeRate} type={BADGE_TYPE.DARK_DEFAULT} />
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
