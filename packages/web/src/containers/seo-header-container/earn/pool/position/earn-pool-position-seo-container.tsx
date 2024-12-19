import React from "react";

import { BaseSEOContainer } from "@containers/seo-header-container/base-seo-container";

interface EarnPoolPositionSEOContainerProps {
  customTitle?: string;
}

export const EarnPoolDecreaseSEOContainer = ({ customTitle }: EarnPoolPositionSEOContainerProps) => {
  return <BaseSEOContainer customTitle={customTitle} path="/earn/pool/position/decrease-liquidity" />;
};

export const EarnPoolIncreaseSEOContainer = ({ customTitle }: EarnPoolPositionSEOContainerProps) => {
  return <BaseSEOContainer customTitle={customTitle} path="/earn/pool/position/increase-liquidity" />;
};

export const EarnPoolRepositionSEOContainer = ({ customTitle }: EarnPoolPositionSEOContainerProps) => {
  return <BaseSEOContainer customTitle={customTitle} path="/earn/pool/position/reposition" />;
};
