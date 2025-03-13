import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";
import { TranslationKey } from "@constants/common.constant";

interface EarnPoolUnstakeSEOContainerProps {
  customTitle?: TranslationKey;
}

export const EarnPoolUnstakeSEOContainer = ({ customTitle }: EarnPoolUnstakeSEOContainerProps) => {
  return <BaseSEOContainer customTitle={customTitle} path="/earn/pool/unstake" />;
};
