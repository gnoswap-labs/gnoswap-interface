import React, { useEffect, useRef } from "react";

import { Overlay } from "@components/common/modal/Modal.styles";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import useLockedBody from "@hooks/common/use-lock-body";

import { LocalModalBackground } from "./withLocalModal.styles";

const withLocalModal = <P extends object>(
  ModalContent: React.ComponentType<P>,
  setIsOpen: (value: boolean) => void,
) => {
  const LocalModal: React.FC<P> = (props: P) => {
    useLockedBody(true);
    useEscCloseModal(() => setIsOpen(false));
    const modalRef = useRef<HTMLDivElement | null>(null);

    const handleResize = () => {
      if (typeof window !== "undefined" && modalRef.current) {
        const height = modalRef.current.getBoundingClientRect().height;
        if (height >= window?.innerHeight) {
          modalRef.current.style.top = "0";
          modalRef.current.style.transform = "translateX(-50%)";
        } else {
          modalRef.current.style.top = "50%";
          modalRef.current.style.transform = "translate(-50%, -50%)";
        }
      }
    };

    useEffect(() => {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [modalRef]);

    return (
      <>
        <LocalModalBackground>
          <div className="content-area" ref={modalRef}>
            <ModalContent {...props} />
          </div>
        </LocalModalBackground>
        <Overlay onClick={() => setIsOpen(false)} />
      </>
    );
  };

  return LocalModal;
};

export default withLocalModal;
