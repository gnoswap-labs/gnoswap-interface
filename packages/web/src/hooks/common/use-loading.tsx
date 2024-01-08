import { useEffect, useState } from "react";

export const useLoading = () => {
  const [isLoadingCommon, setIsLoadingCommon] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoadingCommon(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);
  return {
    isLoadingCommon,
  };
};
