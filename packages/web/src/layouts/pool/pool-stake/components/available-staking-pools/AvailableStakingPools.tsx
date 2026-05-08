import { cx } from "@emotion/css";
import React from "react";
import { useTranslation } from "react-i18next";

import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStar from "@components/common/icons/IconStar";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { IncentivizePoolCardInfo } from "@models/pool/info/pool-card-info";
import { formatRate } from "@utils/new-number-utils";
import { getUniqueRewardTokensWithMultipleRewardTypes } from "@utils/token-utils";

import { wrapper } from "./AvailableStakingPools.styles";

export type AvailableStakingPoolsSortKey = "tvl" | "poolName" | "stakingApr";
export type SortDirection = "asc" | "desc";

interface AvailableStakingPoolsProps {
  pools: IncentivizePoolCardInfo[];
  isLoading: boolean;
  onSelectPool?: (poolPath: string) => void;
  sortKey?: AvailableStakingPoolsSortKey;
  sortDirection?: SortDirection;
  onChangeSort?: (key: AvailableStakingPoolsSortKey) => void;
}

interface SortableHeaderProps {
  label: string;
  align?: "left" | "right";
  columnKey: AvailableStakingPoolsSortKey;
  activeKey?: AvailableStakingPoolsSortKey;
  onClick?: (key: AvailableStakingPoolsSortKey) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ label, align = "left", columnKey, activeKey, onClick }) => {
  const isActive = activeKey === columnKey;
  const handleClick = onClick ? () => onClick(columnKey) : undefined;

  return (
    <span
      className={cx("sortable", `align-${align}`, { active: isActive, clickable: !!onClick })}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
    >
      {label}
    </span>
  );
};

const AvailableStakingPools: React.FC<AvailableStakingPoolsProps> = ({
  pools,
  isLoading,
  onSelectPool,
  sortKey,
  onChangeSort,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();

  return (
    <section css={wrapper}>
      <h5 className="section-title">{t("StakePosition:availablePools.title")}</h5>
      <div className="pools-card">
        <div className="pools-row header">
          <SortableHeader
            label={t("StakePosition:availablePools.column.poolName")}
            align="left"
            columnKey="poolName"
            activeKey={sortKey}
            onClick={onChangeSort}
          />
          <span className="align-right">{t("StakePosition:availablePools.column.incentive")}</span>
          <SortableHeader
            label={t("StakePosition:availablePools.column.stakingApr")}
            align="right"
            columnKey="stakingApr"
            activeKey={sortKey}
            onClick={onChangeSort}
          />
        </div>
        <div className="pools-table">
          {isLoading && (
            <div className="loading">
              <LoadingSpinner size="MEDIUM" />
            </div>
          )}
          {!isLoading && pools.length === 0 && <div className="empty">{t("StakePosition:availablePools.empty")}</div>}
          {!isLoading &&
            pools.map(pool => {
              const tokenData = getUniqueRewardTokensWithMultipleRewardTypes(pool.rewardTokens, getGnotPath);
              const aprValue = Number(pool.apr);
              const showStar = aprValue > 100;
              const poolPath = pool.poolPath;
              return (
                <div
                  key={poolPath ?? pool.poolId}
                  className="pools-row"
                  onClick={onSelectPool && poolPath ? () => onSelectPool(poolPath) : undefined}
                  role={onSelectPool && poolPath ? "button" : undefined}
                >
                  <div className="pool-name">
                    <DoubleLogo
                      left={pool.tokenA.logoURI}
                      right={pool.tokenB.logoURI}
                      leftSymbol={pool.tokenA.symbol}
                      rightSymbol={pool.tokenB.symbol}
                      size={24}
                    />
                    <span className="pair">
                      {pool.tokenA.symbol}/{pool.tokenB.symbol}
                    </span>
                    <span className="fee">{SwapFeeTierInfoMap[pool.feeTier].rateStr}</span>
                  </div>
                  <div className="incentive-cell">
                    <OverlapTokenLogo tokens={tokenData} size={20} showRewardType />
                  </div>
                  <div className="apr-cell">
                    {showStar && <IconStar size={16} />}
                    {pool.apr ? formatRate(pool.apr) : "-"}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default AvailableStakingPools;
