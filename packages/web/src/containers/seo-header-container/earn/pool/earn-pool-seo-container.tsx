import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";
import { TranslationKey } from "@constants/common.constant";

interface EarnPoolSEOContainerProps {
  address?: string;
  customTitle?: TranslationKey;
}

export const EarnPoolSEOContainer = ({ address, customTitle }: EarnPoolSEOContainerProps) => {
  return <BaseSEOContainer path={address ? "/earn/pool?address" : "/earn/pool"} customTitle={customTitle} />;
};
