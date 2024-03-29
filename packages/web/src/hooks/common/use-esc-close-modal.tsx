import { useEffect } from "react";

function useEscCloseModal(callback: () => void) {
  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [callback]);
}

export default useEscCloseModal;
