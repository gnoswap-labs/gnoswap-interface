import { useEffect, useState } from "react";

interface UseLoadingProps {
  trigger: boolean;
}

export const useLoading = (params?: UseLoadingProps) => {
  const [isLoadingCommon, setIsLoadingCommon] = useState(true);

  function startLoading() {
    setIsLoadingCommon(true);
    const timeout = setTimeout(() => {
      setIsLoadingCommon(false);
    }, 1500);

    return timeout;
  }

  useEffect(() => {
    const timeout = (params?.trigger ?? true) ? startLoading() : undefined;
    return () => clearTimeout(timeout);
  }, [params?.trigger]);
  
  return {
    isLoadingCommon: isLoadingCommon,
    setIsLoadingCommon,
    startLoading,
  };
};
