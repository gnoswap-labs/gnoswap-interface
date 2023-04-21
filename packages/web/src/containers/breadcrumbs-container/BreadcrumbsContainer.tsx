import React from "react";
import Breadcrumbs from "@components/common/breadcrumbs/Breadcrumbs";
import { useRouter } from "next/router";

export interface Steps {
  title: string;
  path?: string;
}

const stepsDummy: Steps[] = [
  {
    title: "Earn",
    path: "/earn",
  },
  {
    title: "Add Liquidity",
  },
];

const removePoolSteps = [
  {
    title: "Earn",
    path: "/earn",
  },
  {
    title: "GNOS/GNOT (0.3%)",
    path: "",
  },
  {
    title: "Remove Liquidity",
  },
];

const BreadcrumbsContainer: React.FC = () => {
  const router = useRouter();

  const onClickPath = (path: string) => {
    router.push(path);
  };
  return <Breadcrumbs steps={removePoolSteps} onClickPath={onClickPath} />;
};

export default BreadcrumbsContainer;
