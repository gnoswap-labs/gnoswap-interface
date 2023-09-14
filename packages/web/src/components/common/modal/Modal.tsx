import {
  ModalStyleProps,
  ModalWrapper,
  Overlay,
} from "./Modal.styles";

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
  exitClick,
  style,
  children,
}) => {
  return (
    <>
      <ModalWrapper {...style}>
        {children}
      </ModalWrapper>
      <Overlay onClick={exitClick} />
    </>
  );
};

export default Modal;
