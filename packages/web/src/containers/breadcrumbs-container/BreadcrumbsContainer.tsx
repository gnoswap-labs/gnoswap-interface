import React, { useMemo } from "react";
import Breadcrumbs from "@components/common/breadcrumbs/Breadcrumbs";
import { useRouter } from "next/router";

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

const getMapping: any = (router: any) => {
  return {
    "/earn/add": "Add Liquidity",
    "/earn/stake": "Stake Position",
    "/tokens/[token-path]": `${router.query["token-path"] || "BTC"}`,
  };
};

interface Props {
  listBreadcrumb?: { title: string, path: string } [];
}

const BreadcrumbsContainer: React.FC<Props> = ({ listBreadcrumb }) => {
  const router = useRouter();

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
          getMapping(router)[router.pathname as any] ||
          `${router.query["token-path"] || "BTC"}`,
        path: "",
      },
    ];
  }, [router, getMapping, listBreadcrumb]);

  const onClickPath = (path: string) => {
    router.push(path);
  };
  return <Breadcrumbs steps={removePoolSteps} onClickPath={onClickPath} />;
};

export default BreadcrumbsContainer;
