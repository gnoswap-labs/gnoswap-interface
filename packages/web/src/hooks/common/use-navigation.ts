import { useCallback } from "react";
import useCustomRouter from "@hooks/common/use-custom-router";
import useScrollData from "@hooks/common/use-scroll-data";

/**
 * A custom hook to handle navigation with support for:
 * - Normal navigation (with scroll height preservation)
 * - Opening in new tab when using modifier keys (Ctrl, Meta, Shift, Alt) or middle-click
 */
export const useNavigation = () => {
  const router = useCustomRouter();
  const { saveCurrentScrollHeight } = useScrollData();

  /**
   * Determines if the click event should open in a new tab
   * @param e Mouse event
   * @returns boolean indicating if navigation should open in new tab
   */
  const shouldOpenInNewTab = useCallback((e: React.MouseEvent): boolean => {
    return e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button === 1;
  }, []);

  /**
   * Handles navigation with support for opening in new tab
   * @param e Mouse event
   * @param path Target path
   */
  const handleNavigation = useCallback(
    (e: React.MouseEvent, path: string) => {
      if (shouldOpenInNewTab(e)) {
        // Let the default behavior handle opening in new tab
        return;
      }

      e.preventDefault();
      saveCurrentScrollHeight(window?.location?.pathname);
      router.push(path);
    },
    [router, saveCurrentScrollHeight, shouldOpenInNewTab],
  );

  return {
    handleNavigation,
    shouldOpenInNewTab,
  };
};

export default useNavigation;
