import {
    WrongNetworkModalBackground,
    WrongNetworkModalWrapper,
  } from "./WrongNetworkModal.styles";
  import React, { useRef } from "react";
  import useModalCloseEvent from "@hooks/common/use-modal-close-event";
  import IconClose from "../icons/IconCancel";
  import IconFailed from "../icons/IconFailed";
  import Button, { ButtonHierarchy } from "../button/Button";
import { DEVICE_TYPE } from "@styles/media";
  
  interface Props {
    close: () => void;
    breakpoint: DEVICE_TYPE;
    switchNetwork: () => void;
  }
  const WrongNetworkModal: React.FC<Props> = ({ close, breakpoint, switchNetwork }) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
  
    useModalCloseEvent(modalRef, close);
  

    return (
      <WrongNetworkModalBackground>
        <WrongNetworkModalWrapper>
          <div className="modal-body">
            <div className="header">
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>
            <div className="fail-icon">
              <IconFailed />
            </div>
            <div className="wrong-description">
              <h5>Wrong Network</h5>
              <p>Please set the network to Gnoland Mainnet.</p>
            </div>
            <Button
                onClick={switchNetwork}
              text="Try Again"
              className="try-again-button"
              style={{
                textColor: "text09",
                fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
                hierarchy: ButtonHierarchy.Primary,
              }}
            />
          </div>
        </WrongNetworkModalWrapper>
      </WrongNetworkModalBackground>
    );
  };
  
  export default WrongNetworkModal;
  