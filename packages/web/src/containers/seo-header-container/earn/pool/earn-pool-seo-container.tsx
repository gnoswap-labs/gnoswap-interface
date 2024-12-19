import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";

interface EarnPoolSEOContainerProps {
  address?: string;
  customTitle?: string;
}

export const EarnPoolSEOContainer = ({ address, customTitle }: EarnPoolSEOContainerProps) => {
  return <BaseSEOContainer path={address ? "/earn/pool?address" : "/earn/pool"} customTitle={customTitle} />;
};
