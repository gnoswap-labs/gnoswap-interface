import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useCallback } from "react";
import { Divider, SubmitPositionModalWrapper, ToolTipContentWrapper } from "./SubmitPositionModal.styles";

interface Props {
  close: () => void;
  onSubmit: () => void;
}

const SubmitPositionModal: React.FC<Props> = ({ close, onSubmit }) => {
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
                <div className="value">100.23% ~ 300.69%</div>
              </div>
            </div>
          </div>
          <div className="box-item">
            <h4>Positions</h4>
            <div className="item-content">
              <div>
                <div className="label-logo">
                  <DoubleLogo
                    left="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png"
                    right="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                    size={24}
                  />
                  <div>GNS/GNOT</div>
                  <Badge className="position-bar" text="0.3%" type={BADGE_TYPE.DARK_DEFAULT} />
                </div>
                <div className="value">$145,541.10</div>
              </div>
              <div>
                <div className="label-logo">
                  <DoubleLogo
                    left="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png"
                    right="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                    size={24}
                  />
                  <div>GNS/GNOT</div>
                  <Badge className="position-bar" text="0.3%" type={BADGE_TYPE.DARK_DEFAULT} />
                </div>
                <div className="value">$145,541.10</div>
              </div>
            </div>
          </div>
          <Divider />
          <div className="box-item">
            <div className="item-content">
              <div>
                <div className="label-large">
                  Total Amount
                </div>
                <div className="value-large">$291,082.2</div>
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
