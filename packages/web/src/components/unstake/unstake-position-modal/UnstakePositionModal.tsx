import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconClose from "@components/common/icons/IconCancel";
import { useUnstakeData } from "@hooks/stake/use-unstake-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { numberToUSD } from "@utils/number-utils";
import React, { useCallback } from "react";
import { Divider, UnstakePositionModalWrapper } from "./UnstakePositionModal.styles";

interface Props {
  positions: PoolPositionModel[];
  close: () => void;
  onSubmit: () => void;
}

const UnstakePositionModal: React.FC<Props> = ({ positions, close, onSubmit }) => {
  const { unclaimedRewards, totalLiquidityUSD } = useUnstakeData({ positions });
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <UnstakePositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Unstake Position</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
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
                    <Badge className="unstake-bar" type={BADGE_TYPE.DARK_DEFAULT} text="0.3%" />
                  </div>
                  <div className="value">{numberToUSD(Number(position.positionUsdValue))}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="box-item box-item-unclaim">
            <h4>Unclaimed Rewards</h4>
            <div className="item-content">
              {unclaimedRewards.map((rewardInfo, index) => (
                <div key={index}>
                  <div>
                    <div className="label-logo">
                      <img className="image-logo" src={rewardInfo.token.logoURI} alt="logo" />
                      <div>{rewardInfo.token.symbol}</div>
                    </div>
                    <div className="value">{rewardInfo.amount}</div>
                  </div>
                  <div className="sub-value">{rewardInfo.amountUSD}</div>
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
              text="Confirm Unstake Position"
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
    </UnstakePositionModalWrapper>
  );
};

export default UnstakePositionModal;
