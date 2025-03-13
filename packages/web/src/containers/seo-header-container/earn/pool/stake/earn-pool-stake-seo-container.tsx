import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";
import { TranslationKey } from "@constants/common.constant";

interface EarnPoolStakeSEOContainerProps {
  customTitle?: TranslationKey;
}

export const EarnPoolStakeSEOContainer = ({ customTitle }: EarnPoolStakeSEOContainerProps) => {
  return <BaseSEOContainer customTitle={customTitle} path="/earn/pool/stake" />;
};
