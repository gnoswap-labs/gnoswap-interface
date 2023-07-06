import IconClose from "../icons/IconCancel";
import {
  IconButton,
  ModalHeader,
  ModalStyleProps,
  ModalWrapper,
  Overlay,
} from "./Modal.styles";
import GnoswapModalProvider from "@providers/gnoswap-modal-provider/GnoswapModalProvider";
import IconStrokeArrowLeft from "../icons/IconStrokeArrowLeft";

interface ModalProps {
  hasLeftArrow?: boolean;
  leftArrowClick?: (e: React.MouseEvent<HTMLElement>) => void;
  leftText?: string;
  hasExit?: boolean;
  exitClick?: (e: React.MouseEvent<HTMLElement>) => void;
  style?: ModalStyleProps;
  selector?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  hasLeftArrow = false,
  leftArrowClick,
  leftText,
  hasExit = true,
  exitClick,
  style,
  selector = "portal-root",
  children,
}) => {
  return (
    <GnoswapModalProvider selector={selector}>
      <ModalWrapper {...style}>
        <ModalHeader {...style}>
          {hasLeftArrow && (
            <IconButton onClick={leftArrowClick}>
              <IconStrokeArrowLeft />
            </IconButton>
          )}
          {leftText && <span>{leftText}</span>}
          {hasExit && (
            <IconButton onClick={exitClick} className="exit-button">
              <IconClose />
            </IconButton>
          )}
        </ModalHeader>
        {children}
      </ModalWrapper>
      <Overlay onClick={exitClick} />
    </GnoswapModalProvider>
  );
};

export default Modal;
