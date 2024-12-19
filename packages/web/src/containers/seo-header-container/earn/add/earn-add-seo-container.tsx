import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";

interface EarnAddSEOContainerProps {
  customTitle?: string;
}

export const EarnAddSEOContainer = ({ customTitle }: EarnAddSEOContainerProps) => {
  return <BaseSEOContainer path="/earn/add" customTitle={customTitle} />;
};
