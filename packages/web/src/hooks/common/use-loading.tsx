import { isEmptyObject } from "@utils/validation-utils";
import { useEffect, useState } from "react";

interface Props {
  isLoading: boolean;
  isFetching: boolean;
  isBack: boolean;
  status: boolean;
}

export const useLoading = (params?: Props) => {
  const [isLoadingCommon, setIsLoadingCommon] = useState(true);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (params?.isLoading || isEmptyObject(params || {}) || !params?.isBack) {
      timeout = setTimeout(() => {
        setIsLoadingCommon(false);
      }, 1500);
      return;
    } else {
      if (!isEmptyObject(params || {})) {
        if (params?.isBack || params?.status) {
          setIsLoadingCommon(true);
          timeout = setTimeout(() => {
            setIsLoadingCommon(false);
          }, 1500);
        }
      }
      return;
    }
    return () => clearTimeout(timeout);
  }, [params?.isBack, params?.isLoading, params?.status]);
  return {
    isLoadingCommon,
  };
};
