import { useCallback, useEffect } from "react";

function useModalCloseEvent(modal: React.RefObject<HTMLElement | null>, callback: () => void) {
  const handleEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callback();
      }
    },
    [callback],
  );

  const onClickOutbound = useCallback(
    (event: MouseEvent) => {
      if (!modal.current) {
        return;
      }
      if (modal.current.contains(event.target as Node)) {
        return;
      }
      callback();
    },
    [modal, callback],
  );

  useEffect(() => {
    window.addEventListener("click", onClickOutbound, true);
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("click", onClickOutbound, true);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleEsc, onClickOutbound]);
}

export default useModalCloseEvent;
