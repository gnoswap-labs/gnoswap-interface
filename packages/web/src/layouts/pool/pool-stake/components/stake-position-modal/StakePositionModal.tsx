import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import Tooltip from "@components/common/tooltip/Tooltip";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { formatOtherPrice, formatRate } from "@utils/new-number-utils";
import { isInRangePosition } from "@utils/stake-position-utils";
import { formatDisplayTokenSymbol } from "@utils/token-utils";

import { Divider, StakePositionModalWrapper, ToolTipContentWrapper } from "./StakePositionModal.styles";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";

interface Props {
  positions: PoolPositionModel[];
  close: () => void;
  onSubmit: () => void;
}

const StakePositionModal: React.FC<Props> = ({ positions, close, onSubmit }) => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();

  const totalLiquidityUSD = useMemo(() => {
    const totalLiquidity = positions.reduce((accum, position) => accum + Number(position.positionUsdValue), 0);
    return formatOtherPrice(totalLiquidity);
  }, [positions]);

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  const stakingAPR = useMemo(() => {
    // USD-Value-weighted average of each selected position's pool staking APR:
    //   APR = Σ (pool_APR_i × USD_i) / Σ USD_j
    // Mirrors SelectStakeResult so the value the user reviews before opening
    // the confirm modal matches the value they confirm. Computed from the
    // selection itself (not the single `pool` prop) because mixed-pool selection
    // is allowed and the URL-bound pool may be undefined on `/earn/stake`.
    let weightedSum = 0;
    let totalWeight = 0;

    for (const position of positions) {
      const weight = Number(position.positionUsdValue ?? 0);
      if (!Number.isFinite(weight) || weight <= 0) continue;

      const aprValue = Number(position.pool?.stakingApr ?? 0);
      const contribution = Number.isFinite(aprValue) && aprValue > 0 ? aprValue : 0;

      weightedSum += contribution * weight;
      totalWeight += weight;
    }

    if (totalWeight <= 0) return "-";
    const averageApr = weightedSum / totalWeight;
    if (averageApr === 0) return "0%";
    return `${formatRate(averageApr * 0.3)} ~ ${formatRate(averageApr)}`;
  }, [positions]);

  const inRange = useCallback((position: PoolPositionModel) => isInRangePosition(position), []);

  return (
    <StakePositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>{t("StakePosition:confStakeModal.title")}</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div className="box-item">
            <h4>{t("StakePosition:confStakeModal.stakingReward.title")}</h4>
            <div className="item-content">
              <div>
                <div className="label">
                  {t("StakePosition:overview.stakingApr.label")}
                  <Tooltip
                    placement="top"
                    FloatingContent={
                      <ToolTipContentWrapper>{t("StakePosition:overview.stakingApr.tooltip")}</ToolTipContentWrapper>
                    }
                  >
                    <IconInfo />
                  </Tooltip>
                </div>
                <div className="value">{stakingAPR}</div>
              </div>
            </div>
          </div>
          <div className="box-item">
            <h4>{t("StakePosition:confStakeModal.positionLst")}</h4>
            <div className="item-content">
              {positions.map((position, index) => (
                <div key={index}>
                  <div className="label-logo">
                    <DoubleLogo
                      left={position.pool.tokenA.logoURI}
                      right={position.pool.tokenB.logoURI}
                      size={24}
                      leftSymbol={position.pool.tokenA.symbol}
                      rightSymbol={position.pool.tokenB.symbol}
                    />
                    {breakpoint !== DEVICE_TYPE.MOBILE && (
                      <div>{`${formatDisplayTokenSymbol(position.pool.tokenA.symbol)}/${formatDisplayTokenSymbol(
                        position.pool.tokenB.symbol,
                      )}`}</div>
                    )}
                    <Badge
                      className="position-bar"
                      text={`${Number(position.pool.fee) / 10000}%`}
                      type={BADGE_TYPE.DARK_DEFAULT}
                    />
                    <RangeBadge status={inRange(position) ? "IN" : "OUT"} />
                  </div>
                  <div className="value">
                    {formatOtherPrice(position.positionUsdValue, {
                      isKMB: false,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Divider />
          <div className="box-item">
            <div className="item-content">
              <div>
                <div className="label-large">{t("StakePosition:overview.totalAmt")}</div>
                <div className="value-large">{totalLiquidityUSD}</div>
              </div>
            </div>
          </div>
          <div>
            <Button
              text={t("StakePosition:confStakeModal.title")}
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              className="button-confirm"
              onClick={onSubmit}
            />
          </div>
        </div>
      </div>
    </StakePositionModalWrapper>
  );
};

export default StakePositionModal;
