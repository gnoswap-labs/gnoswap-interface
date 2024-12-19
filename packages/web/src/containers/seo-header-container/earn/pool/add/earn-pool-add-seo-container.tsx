import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";

interface EarnPoolAddSEOContainerProps {
  customTitle?: string;
}

export const EarnPoolAddSEOContainer = ({ customTitle }: EarnPoolAddSEOContainerProps) => {
  return <BaseSEOContainer path="/earn/pool/add" customTitle={customTitle} />;
};
