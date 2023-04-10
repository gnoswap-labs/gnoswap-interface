import React from "react";
import Breadcrumbs from "@components/common/breadcrumbs/Breadcrumbs";
import { useRouter } from "next/router";

export interface Steps {
  title: string;
  path?: string;
}

const steps: Steps[] = [
  {
    title: "Earn",
    path: "/earn",
  },
  {
    title: "GNOS/GNOT (0.3%)",
  },
];

const BreadcrumbsContainer: React.FC = () => {
  const router = useRouter();

  const onClickPath = (path: string) => {
    router.push(path);
  };
  return <Breadcrumbs steps={steps} onClickPath={onClickPath} />;
};

export default BreadcrumbsContainer;
