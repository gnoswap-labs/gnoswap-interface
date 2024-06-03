import React, { useMemo } from "react";
import Breadcrumbs from "@components/common/breadcrumbs/Breadcrumbs";
import useRouter from "@hooks/common/use-custom-router";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useGetTokenByPath } from "@query/token";

export interface Steps {
  title: string;
  path?: string;
}

// const stepsDummy: Steps[] = [
//   {
//     title: "Earn",
//     path: "/earn",
//   },
//   {
//     title: "Add Liquidity",
//   },
// ];

const getMapping: any = (symbol: any) => {
  return {
    "/earn/add": "Add Liquidity",
    "/earn/stake": "Stake Position",
    "/tokens/[token-path]": `${symbol || "Loading..."}`,
  };
};

interface Props {
  listBreadcrumb?: { title: string; path: string }[];
  isLoading?: boolean;
  w?: string;
}

const BreadcrumbsContainer: React.FC<Props> = ({
  listBreadcrumb,
  isLoading,
  w = "200px",
}) => {
  const router = useRouter();
  const path = router.query["token-path"] as string;
  const { data: tokenB } = useGetTokenByPath(path, {
    enabled: !!path,
    refetchInterval: 1000 * 10,
  });
  const removePoolSteps = useMemo(() => {
    if (listBreadcrumb) {
      return listBreadcrumb;
    }
    return [
      {
        title: "Main",
        path: "/",
      },
      {
        title:
          getMapping(tokenB?.symbol || "")[router.pathname as any] ||
          `${tokenB?.symbol || "BTC"}`,
        path: "",
      },
    ];
  }, [tokenB, getMapping, listBreadcrumb]);

  const onClickPath = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return <div css={pulseSkeletonStyle({ w: w, h: 26 })} />;
  }

  return <Breadcrumbs steps={removePoolSteps} onClickPath={onClickPath} />;
};

export default BreadcrumbsContainer;
