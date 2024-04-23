import { useEffect, useState } from "react";

interface UseLoadingProps {
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
    return () => clearTimeout(timeout);
  }, [params?.shouldTrigger]);
  
  return {
    isLoadingCommon: isLoadingCommon,
    setIsLoadingCommon,
    triggerLoading,
  };
};
