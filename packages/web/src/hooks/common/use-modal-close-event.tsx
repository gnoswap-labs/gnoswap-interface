import { useEffect } from "react";

function useModalCloseEvent(
  modal: React.RefObject<HTMLElement | null>,
  callback: () => void
) {
  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      callback();
    }
  };

  function onClickOutbound(event: MouseEvent) {
    if (!modal.current) {
      return;
    }
    if (modal.current.contains(event.target as Node)) {
      return;
    }
    callback();
  }

  useEffect(() => {
    window.addEventListener("click", onClickOutbound, true);
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("click", onClickOutbound, true);
      window.addEventListener("keydown", handleEsc);
    };
  }, []);
}

export default useModalCloseEvent;
