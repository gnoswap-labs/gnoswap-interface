import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";
import { TranslationKey } from "@constants/common.constant";

interface EarnIncentivizeSEOContainerProps {
  customTitle?: TranslationKey;
}

export const EarnIncentivizeSEOContainer = ({ customTitle }: EarnIncentivizeSEOContainerProps) => {
  return <BaseSEOContainer path="/earn/incentivize" customTitle={customTitle} />;
};
