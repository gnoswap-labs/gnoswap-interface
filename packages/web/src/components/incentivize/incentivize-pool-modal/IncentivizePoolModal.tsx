
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconClose from "@components/common/icons/IconCancel";
import React, { useCallback } from "react";
import { IncentivizePoolModalWrapper } from "./IncentivizePoolModal.styles";

interface Props {
  close: () => void;
  onSubmit: () => void;
}

const IncentivizePoolModal: React.FC<Props> = ({ close, onSubmit }) => {
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <IncentivizePoolModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Incentivize Pool</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div className="box-item">
            <h4>Rewards</h4>
            <div className="item-content">
              <div>
                <div className="label">Pool</div>
                <div className="value-content">
                  <DoubleLogo
                    left="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png"
                    right="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                    size={24}
                  />
                  <div className="value">GNS/GNOS</div>
                  <Badge type={BADGE_TYPE.DARK_DEFAULT} text={"0.3%"} />
                </div>
              </div>
              <div>
                <div className="label">Total Amount</div>
                <div className="value-content">
                  <img className="image-logo" src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" alt="logo" />
                  <div className="value">106,208.255 GNS</div>
                </div>
              </div>
              <div>
                <div className="label">Period</div>
                <div className="value-content value-content-column">
                  <div className="value">2022-12-06 00:00 <br />
                    - 2023-01-05 00:00</div>
                  <div className="sub-value">1,820.5 GNS will be distributed daily</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Button
              text="Confirm Incentivize Pool"
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
    </IncentivizePoolModalWrapper>
  );
};

export default IncentivizePoolModal;
