import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";

interface EarnPoolUnstakeSEOContainerProps {
  customTitle?: string;
}

export const EarnPoolUnstakeSEOContainer = ({ customTitle }: EarnPoolUnstakeSEOContainerProps) => {
  return <BaseSEOContainer customTitle={customTitle} path="/earn/pool/unstake" />;
};
