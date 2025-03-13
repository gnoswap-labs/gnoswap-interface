import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";
import { TranslationKey } from "@constants/common.constant";

interface EarnPoolIncentivizeSEOContainerProps {
  customTitle?: TranslationKey;
}

export const EarnPoolIncentivizeSEOContainer = ({ customTitle }: EarnPoolIncentivizeSEOContainerProps) => {
  return <BaseSEOContainer path="/earn/pool/incentivize" customTitle={customTitle} />;
};
