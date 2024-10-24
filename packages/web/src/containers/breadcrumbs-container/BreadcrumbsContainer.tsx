import React, { useMemo } from "react";
import Breadcrumbs from "@components/common/breadcrumbs/Breadcrumbs";
import useRouter from "@hooks/common/use-custom-router";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useGetToken } from "@query/token";
import { ITokenResponse } from "@repositories/token";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTranslation } from "react-i18next";

export type BreadcrumbTypes = "TOKEN_SYMBOL" | "OTHERs";
export interface Steps {
  title: string;
  path?: string;
  options?: {
    type?: BreadcrumbTypes;
    token?: ITokenResponse;
  };
}

const getMapping: (symbol: string) => Record<string, string> = (
  symbol: string,
) => {
  return {
    "/earn/add": "Add Liquidity",
    "/earn/stake": "Stake Position",
    "/token": `${symbol || "Loading..."}`,
  };
};

interface Props {
  listBreadcrumb?: Steps[];
  isLoading?: boolean;
  w?: string;
}

const BreadcrumbsContainer: React.FC<Props> = ({
  listBreadcrumb,
  isLoading,
  w = "200px",
}) => {
  const router = useRouter();
  const { getGnotPath } = useGnotToGnot();
  const path = router.getTokenPath();
  const { data: tokenB } = useGetToken(path, {
    enabled: !!path,
  });
  const { t } = useTranslation();

  const removePoolSteps = useMemo(() => {
    if (listBreadcrumb) {
      return listBreadcrumb;
    }
    return [
      {
        title: t("common:main"),
        path: "/",
      },
      {
        title:
          getMapping(tokenB?.symbol || "")[router.pathname] ||
          `${getGnotPath(tokenB)?.symbol || "BTC"}`,
        path: "",
      },
    ];
  }, [listBreadcrumb, router.pathname, tokenB, getGnotPath, t]);

  const onClickPath = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return <div css={pulseSkeletonStyle({ w: w, h: 26 })} />;
  }

  return <Breadcrumbs steps={removePoolSteps} onClickPath={onClickPath} />;
};

export default BreadcrumbsContainer;
