import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";

interface EarnPoolIncentivizeSEOContainerProps {
  customTitle?: string;
}

export const EarnPoolIncentivizeSEOContainer = ({ customTitle }: EarnPoolIncentivizeSEOContainerProps) => {
  return <BaseSEOContainer path="/earn/pool/incentivize" customTitle={customTitle} />;
};
