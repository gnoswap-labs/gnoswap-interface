import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { PoolModel } from "@models/pool/pool-model";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { formatOtherPrice, formatRate } from "@utils/new-number-utils";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Divider,
  StakePositionModalWrapper,
  ToolTipContentWrapper,
} from "./StakePositionModal.styles";

interface Props {
  positions: PoolPositionModel[];
  close: () => void;
  onSubmit: () => void;
  pool?: PoolModel;
}

const StakePositionModal: React.FC<Props> = ({
  positions,
  close,
  onSubmit,
  pool,
}) => {
  const { t } = useTranslation();

  const totalLiquidityUSD = useMemo(() => {
    const totalLiquidity = positions.reduce(
      (accum, position) => accum + Number(position.positionUsdValue),
      0,
    );
    return formatOtherPrice(totalLiquidity);
  }, [positions]);

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  const stakingAPR = useMemo(() => {
    if (!pool?.stakingApr) return "-";

    if (Number(pool.stakingApr) === 0) return "0%";

    return `${formatRate(Number(pool?.stakingApr || 0) * 0.3)} ~ ${formatRate(
      pool?.stakingApr,
    )}`;
  }, [pool?.stakingApr]);

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
                  {t("StakePosition:confStakeModal.stakingReward.apr.label")}
                  <Tooltip
                    placement="top"
                    FloatingContent={
                      <ToolTipContentWrapper>
                        {t(
                          "StakePosition:confStakeModal.stakingReward.apr.tooltip",
                        )}
                      </ToolTipContentWrapper>
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
                    <div>{`${position.pool.tokenA.symbol}/${position.pool.tokenB.symbol}`}</div>
                    <Badge
                      className="position-bar"
                      text={`${Number(position.pool.fee) / 10000}%`}
                      type={BADGE_TYPE.DARK_DEFAULT}
                    />
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
                <div className="label-large">
                  {t("StakePosition:confStakeModal.totalAmt")}
                </div>
                <div className="value-large">{totalLiquidityUSD}</div>
              </div>
            </div>
          </div>
          <div>
            <Button
              text={t("StakePosition:confStakeModal.btn")}
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
