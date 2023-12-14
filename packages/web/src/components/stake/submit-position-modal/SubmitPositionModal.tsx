import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { numberToUSD } from "@utils/number-utils";
import React, { useCallback, useMemo } from "react";
import { Divider, SubmitPositionModalWrapper, ToolTipContentWrapper } from "./SubmitPositionModal.styles";

interface Props {
  positions: PoolPositionModel[];
  close: () => void;
  onSubmit: () => void;
}

const SubmitPositionModal: React.FC<Props> = ({ positions, close, onSubmit }) => {
  const totalLiquidityUSD = useMemo(() => {
    const totalLiquidity = positions.reduce((accum, position) => accum + Number(position.positionUsdValue), 0);
    return numberToUSD(totalLiquidity);
  }, [positions]);

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <SubmitPositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Stake Position</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div className="box-item">
            <h4>Staking Rewards</h4>
            <div className="item-content">
              <div>
                <div className="label">
                  Staking APR
                  <Tooltip
                    placement="top"
                    FloatingContent={<ToolTipContentWrapper>
                      The estimated APR range is calculated by applying a dynamic multiplier to your staked position, based on the staking duration.
                    </ToolTipContentWrapper>}
                  >
                    <IconInfo />
                  </Tooltip>
                </div>
                <div className="value">-</div>
              </div>
            </div>
          </div>
          <div className="box-item">
            <h4>Positions</h4>
            <div className="item-content">
              {positions.map((position, index) => (
                <div key={index}>
                  <div className="label-logo">
                    <DoubleLogo
                      left={position.pool.tokenA.logoURI}
                      right={position.pool.tokenB.logoURI}
                      size={24}
                    />
                    <div>{`${position.pool.tokenA.symbol}/${position.pool.tokenB.symbol}`}</div>
                    <Badge className="position-bar" text="0.3%" type={BADGE_TYPE.DARK_DEFAULT} />
                  </div>
                  <div className="value">{numberToUSD(Number(position.positionUsdValue))}</div>
                </div>
              ))}
            </div>
          </div>
          <Divider />
          <div className="box-item">
            <div className="item-content">
              <div>
                <div className="label-large">
                  Total Amount
                </div>
                <div className="value-large">{totalLiquidityUSD}</div>
              </div>
            </div>
          </div>
          <div>
            <Button
              text="Confirm Stake Position"
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
    </SubmitPositionModalWrapper>
  );
};

export default SubmitPositionModal;
