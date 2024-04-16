import { useEffect, useState } from "react";

interface UseLoadingProps {
  // isLoading: boolean;
  // isFetching: boolean;
  // isBack: boolean;
  // status: boolean;
  // connected: boolean;
  shouldTrigger: boolean;
}

export const useLoading = (params?: UseLoadingProps) => {
  const [isLoadingCommon, setIsLoadingCommon] = useState(true);

  function triggerLoading() {
    setIsLoadingCommon(true);
    const timeout = setTimeout(() => {
      setIsLoadingCommon(false);
    }, 1500);

    return timeout;
  }

  useEffect(() => {
    const timeout = (params?.shouldTrigger ?? true) ? triggerLoading() : undefined;

    // if(params?.connected) {
    //   triggerLoading();
    //   return;
    // }

    // if (!params?.connected && (params?.isLoading || isEmptyObject(params || {}) || !params?.isBack)) {
    //   triggerLoading();
    //   return;
    // }

    // if (params?.isBack || params?.status) {
    //   triggerLoading();
    //   return;
    // }

    // ===============================================================================================

    // if (params?.connected) {
    //   setIsLoadingCommon(true);
    //   timeout = setTimeout(() => {
    //     setIsLoadingCommon(false);
    //   }, 1500);
    // } else if (params?.isLoading || isEmptyObject(params || {}) || !params?.isBack) {
    //   timeout = setTimeout(() => {
    //     setIsLoadingCommon(false);
    //   }, 1500);
    // } else {
    //   if (!isEmptyObject(params || {})) {
    //     if (params?.isBack || params?.status) {
    //       setIsLoadingCommon(true);
    //       timeout = setTimeout(() => {
    //         setIsLoadingCommon(false);
    //       }, 1500);
    //     }
    //   }
    // }
    return () => clearTimeout(timeout);
  }, [params?.shouldTrigger]);
  
  return {
    isLoadingCommon: isLoadingCommon,
    setIsLoadingCommon,
    triggerLoading,
  };
};
