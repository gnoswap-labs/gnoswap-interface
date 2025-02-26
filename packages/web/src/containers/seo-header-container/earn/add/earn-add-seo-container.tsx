import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";

interface EarnAddSEOContainerProps {
  customTitle?: string;
  titleParams?: (string | undefined)[];
}

export const EarnAddSEOContainer = ({ customTitle, titleParams }: EarnAddSEOContainerProps) => {
  return <BaseSEOContainer path="/earn/add" customTitle={customTitle} titleParams={titleParams} />;
};
