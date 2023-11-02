import { usePositionModal } from "@hooks/common/use-postion-modal";
import {
  ModalStyleProps,
  ModalWrapper,
  Overlay,
} from "./Modal.styles";
import { useRef } from "react";

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
  const modalRef = useRef<HTMLDivElement | null>(null);
  usePositionModal(modalRef);

  return (
    <>
      <ModalWrapper ref={modalRef} {...style}>
        {children}
      </ModalWrapper>
      <Overlay onClick={exitClick} />
    </>
  );
};

export default Modal;
