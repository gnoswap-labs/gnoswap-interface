import { cx } from "@emotion/css";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStar from "@components/common/icons/IconStar";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { QUERY_PARAMETER } from "@constants/page.constant";
import { usePrefetchNavigation } from "@hooks/common/use-prefetch-navigation";
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
  const handleKeyDown = onClick
    ? (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(columnKey);
        }
      }
    : undefined;

  return (
    <span
      className={cx("sortable", `align-${align}`, { active: isActive, clickable: !!onClick })}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {label}
    </span>
  );
};

interface AvailableStakingPoolRowProps {
  pool: IncentivizePoolCardInfo;
  getGnotPath: ReturnType<typeof useGnotToGnot>["getGnotPath"];
  onSelectPool?: (poolPath: string) => void;
}

const AvailableStakingPoolRow: React.FC<AvailableStakingPoolRowProps> = ({ pool, getGnotPath, onSelectPool }) => {
  const tokenData = getUniqueRewardTokensWithMultipleRewardTypes(pool.rewardTokens, getGnotPath);
  const aprValue = Number(pool.stakingApr);
  const showStar = aprValue > 100;
  const poolPath = pool.poolPath;
  const isSelectable = !!(onSelectPool && poolPath);
  const feeRateStr = SwapFeeTierInfoMap[pool.feeTier]?.rateStr ?? "-";

  // Prefetch the pool detail page (staking section) on hover for faster navigation,
  // matching the /tokens table behavior.
  const { prefetch } = usePrefetchNavigation({
    pageType: "POOL",
    params: poolPath ? { [QUERY_PARAMETER.POOL_PATH]: poolPath } : undefined,
    hash: "staking",
    enabled: isSelectable,
  });

  const handleRowClick = useCallback(() => {
    if (isSelectable) onSelectPool!(poolPath!);
  }, [isSelectable, onSelectPool, poolPath]);

  const handleRowKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isSelectable) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectPool!(poolPath!);
      }
    },
    [isSelectable, onSelectPool, poolPath],
  );

  return (
    <div
      className="pools-row"
      onClick={isSelectable ? handleRowClick : undefined}
      onKeyDown={isSelectable ? handleRowKeyDown : undefined}
      onMouseEnter={isSelectable ? prefetch : undefined}
      role={isSelectable ? "button" : undefined}
      tabIndex={isSelectable ? 0 : undefined}
    >
      <div className="pool-name">
        <DoubleLogo
          left={pool.tokenA.logoURI}
          right={pool.tokenB.logoURI}
          leftSymbol={pool.tokenA.symbol}
          rightSymbol={pool.tokenB.symbol}
          size={20}
        />
        <span className="pair">
          {pool.tokenA.symbol}/{pool.tokenB.symbol}
        </span>
        <span className="fee">{feeRateStr}</span>
      </div>
      <div className="incentive-cell">
        <OverlapTokenLogo tokens={tokenData} size={20} showRewardType />
      </div>
      <div className="apr-cell">
        {showStar && <IconStar size={16} />}
        {pool.stakingApr ? formatRate(pool.stakingApr) : "-"}
      </div>
    </div>
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
      <div className="pools-card">
        <h5 className="section-title">{t("StakePosition:availablePools.title")}</h5>
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
            pools.map(pool => (
              <AvailableStakingPoolRow
                key={pool.poolPath ?? pool.poolId}
                pool={pool}
                getGnotPath={getGnotPath}
                onSelectPool={onSelectPool}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default AvailableStakingPools;
