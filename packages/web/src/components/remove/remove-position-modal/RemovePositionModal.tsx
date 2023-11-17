import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconClose from "@components/common/icons/IconCancel";
import React, { useCallback } from "react";
import { Divider, RemovePositionModalWrapper } from "./RemovePositionModal.styles";

interface Props {
  close: () => void;
  onSubmit: () => void;
}

const RemovePositionModal: React.FC<Props> = ({ close, onSubmit }) => {
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <RemovePositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Remove Position</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
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
                  <div>ID 14450</div>
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
                  <div>ID 14450</div>
                </div>
                <div className="value">$145,541.10</div>
              </div>
            </div>
          </div>
          <div className="box-item box-item-unclaim">
            <h4>Unclaimed Fees</h4>
            <div className="item-content">
              <div>
                <div>
                  <div className="label-logo">
                    <img className="image-logo" src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" alt="logo" />
                    <div>GNS</div>
                  </div>
                  <div className="value">15,000.005</div>
                </div>
                <div className="sub-value">
                  $15,000.01
                </div>
              </div>
              <div>
                <div>
                  <div className="label-logo">
                    <img className="image-logo" src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" alt="logo" />
                    <div>GNS</div>
                  </div>
                  <div className="value">15,000.005</div>
                </div>
                <div className="sub-value">
                  $15,000.01
                </div>
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
              text="Confirm Remove Position"
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
    </RemovePositionModalWrapper>
  );
};

export default RemovePositionModal;
