import { useEffect, useState } from "react";

interface UseLoadingProps {
  loadable: boolean;
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
    const timeout = (params?.loadable ?? true) ? startLoading() : undefined;
    return () => clearTimeout(timeout);
  }, [params?.loadable]);
  
  return {
    isLoadingCommon: isLoadingCommon,
    setIsLoadingCommon,
    startLoading,
  };
};
