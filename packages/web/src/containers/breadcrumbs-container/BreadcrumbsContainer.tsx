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

const BreadcrumbsContainer: React.FC = () => {
  const router = useRouter();

  const removePoolSteps = useMemo(() => {
    return [
      {
        title: "Main",
        path: "/",
      },
      {
        title: `${router.query["token-path"] || "BTC"}`,
        path: "",
      },
    ];
  }, [router.query]);

  const onClickPath = (path: string) => {
    router.push(path);
  };
  return <Breadcrumbs steps={removePoolSteps} onClickPath={onClickPath} />;
};

export default BreadcrumbsContainer;
