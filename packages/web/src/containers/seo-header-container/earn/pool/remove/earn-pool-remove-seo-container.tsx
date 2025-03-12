import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";
import { TranslationKey } from "@constants/common.constant";

interface EarnPoolRemoveSEOContainerProps {
  customTitle?: TranslationKey;
}

export const EarnPoolRemoveSEOContainer = ({ customTitle }: EarnPoolRemoveSEOContainerProps) => {
  return <BaseSEOContainer customTitle={customTitle} path="/earn/pool/remove" />;
};
