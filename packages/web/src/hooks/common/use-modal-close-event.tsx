import { useEffect } from "react";

function useModalCloseEvent(modal: React.RefObject<HTMLElement | null>, callback: () => void) {

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
    return () => {
      window.removeEventListener("click", onClickOutbound, true);
    };
  });
}

export default useModalCloseEvent;
