import { CommonState } from "@states/index";
import { useAtom } from "jotai";

const useScrollData = () => {
  const [pageScrollMap, setPageScrollMap] = useAtom(CommonState.pageScrollMap);
  const [previousPageScroll, setPreviousPageScroll] = useAtom(
    CommonState.previousPageScroll,
  );

  function getScrollHeight(path: string): number {
    return pageScrollMap[path] || 0;
  }

  function saveScrollHeight(path: string, height: number) {
    console.log(path, height);
    setPreviousPageScroll({ page: path, height });
    setPageScrollMap(prev => ({
      ...prev,
      [path]: height,
    }));
  }

  function saveCurrentScrollHeight(path: string) {
    saveScrollHeight(path, window?.scrollY || 0);
  }

  function scrollTo(height: number, smooth?: boolean) {
    window?.scrollTo({ top: height, behavior: smooth ? "smooth" : "auto" });
  }

  return {
    previousPageScroll,
    getScrollHeight,
    saveScrollHeight,
    saveCurrentScrollHeight,
    scrollTo,
  };
};

export default useScrollData;
