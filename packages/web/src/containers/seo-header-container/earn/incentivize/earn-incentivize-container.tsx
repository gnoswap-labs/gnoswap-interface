import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";

interface EarnIncentivizeSEOContainerProps {
  customTitle?: string;
}

export const EarnIncentivizeSEOContainer = ({ customTitle }: EarnIncentivizeSEOContainerProps) => {
  return <BaseSEOContainer path="/earn/incentivize" customTitle={customTitle} />;
};
