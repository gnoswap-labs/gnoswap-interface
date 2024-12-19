import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";

interface EarnPoolRemoveSEOContainerProps {
  customTitle?: string;
}

export const EarnPoolRemoveSEOContainer = ({ customTitle }: EarnPoolRemoveSEOContainerProps) => {
  return <BaseSEOContainer customTitle={customTitle} path="/earn/pool/remove" />;
};
