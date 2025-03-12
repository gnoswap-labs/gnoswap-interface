import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";
import { TranslationKey } from "@constants/common.constant";

interface EarnPoolAddSEOContainerProps {
  customTitle?: string | TranslationKey;
}

export const EarnPoolAddSEOContainer = ({ customTitle }: EarnPoolAddSEOContainerProps) => {
  return <BaseSEOContainer path="/earn/pool/add" customTitle={customTitle} />;
};
