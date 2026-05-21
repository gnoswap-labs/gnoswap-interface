import { useCallback } from "react";
import useCustomRouter from "@hooks/common/use-custom-router";
import useScrollData from "@hooks/common/use-scroll-data";
import { makeRouteUrl } from "@utils/page.utils";

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
   */
  const handleNavigation = useCallback(
    (e: React.MouseEvent) => {
      if (shouldOpenInNewTab(e)) {
        return;
      }

      saveCurrentScrollHeight(window?.location?.pathname);
    },
    [saveCurrentScrollHeight, shouldOpenInNewTab],
  );

  const getNavigationPath = useCallback(
    (path: string) => {
      return makeRouteUrl(path, router.getParamsWithReferrer());
    },
    [router],
  );

  return {
    handleNavigation,
    getNavigationPath,
    shouldOpenInNewTab,
  };
};

export default useNavigation;
