import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconFailed from "@components/common/icons/IconFailed";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { Overlay } from "@components/common/modal/Modal.styles";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { usePositionModal } from "@hooks/common/use-postion-modal";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { formatAddress } from "@utils/string-utils";
import React, { useCallback, useRef, useState } from "react";
import {
  BoxDescription,
  BoxFromTo,
  DepositContent,
  DepositModalBackground,
  DepositModalWrapper,
  IconButton,
} from "./DepositModal.styles";

interface Props {
  close: () => void;
  breakpoint: DEVICE_TYPE;
  depositInfo: TokenModel;
  fromToken: TokenModel;
  toToken: TokenModel;
  connected: boolean;
  changeToken: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const DepositModal: React.FC<Props> = ({
  close,
  breakpoint,
  depositInfo,
  fromToken,
  toToken,
  connected,
  changeToken,
  callback,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [amount, setAmount] = useState("0");

  useEscCloseModal(close);
  usePositionModal(modalRef);
  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;
      setAmount(value);
      // TODO
      // - mapT0AmountToT0Price
      // - mapT0AmpuntT1Amount
      // - mapT1AmpuntT1Price
    },
    [],
  );

  return (
    <>
      <DepositModalBackground>
        <DepositModalWrapper ref={modalRef}>
          <div className="modal-body">
            <div className="header">
              <h6>IBC Deposit</h6>
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>
            <DepositContent>
              <div className="deposit">
                <div className="amount">
                  <input
                    className="amount-text"
                    value={amount}
                    onChange={onChangeAmount}
                    placeholder="0"
                  />
                  <div className="token">
                    <SelectPairButton
                      token={depositInfo}
                      changeToken={changeToken}
                      callback={callback}
                      isHiddenArrow
                      disabled
                    />
                  </div>
                </div>
                <div className="info">
                  <span className="price-text">{!Number(amount) ? "-" : `$${amount}`}</span>
                  <span className="balance-text">Available: -</span>
                </div>
              </div>
            </DepositContent>
            <BoxFromTo>
              <div className="from">
                <h5>From</h5>
                <div>
                  <img
                    src={fromToken.logoURI}
                    alt="token logo"
                    className="token-logo"
                  />
                  <strong className="token-name">{fromToken.symbol}</strong>
                </div>
                <p>{formatAddress(fromToken.address)}</p>
              </div>
              <IconButton>
                <IconStrokeArrowRight />
              </IconButton>
              <div className="to">
                <h5>To</h5>
                <div>
                  <img
                    src={toToken.logoURI}
                    alt="token logo"
                    className="token-logo"
                  />
                  <strong className="token-name">{toToken.symbol}</strong>
                </div>
                <p>{formatAddress(toToken.address)}</p>
              </div>
            </BoxFromTo>
            <BoxDescription>
              <IconFailed className="fail-icon" />
              <p>This feature will be available once Gnoland enables IBC.</p>
            </BoxDescription>
            <Button
              disabled={true}
              text="Deposit"
              className="btn-deposit"
              style={{
                fullWidth: true,
                textColor: "text09",
                fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
                hierarchy:
                  connected && !Number(amount || 0)
                    ? undefined
                    : ButtonHierarchy.Primary,
                bgColor:
                  connected && !Number(amount || 0) ? "background17" : undefined,
              }}
            />
          </div>
        </DepositModalWrapper>
      </DepositModalBackground>
      <Overlay onClick={close}/>
    </>
  );
};

export default DepositModal;
