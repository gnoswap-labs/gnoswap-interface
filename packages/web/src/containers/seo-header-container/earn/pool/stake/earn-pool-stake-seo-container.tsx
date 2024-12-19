import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";

interface EarnPoolStakeSEOContainerProps {
  customTitle?: string;
}

export const EarnPoolStakeSEOContainer = ({ customTitle }: EarnPoolStakeSEOContainerProps) => {
  return <BaseSEOContainer customTitle={customTitle} path="/earn/pool/stake" />;
};
