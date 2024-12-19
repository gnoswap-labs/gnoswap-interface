import React from "react";

import { formatAddress } from "@utils/string-utils";

import { BaseSEOContainer } from "../base-seo-container";

interface EarnSEOContainerProps {
  address?: string | null;
}

export const EarnSEOContainer = ({ address }: EarnSEOContainerProps) => {
  return (
    <BaseSEOContainer
      path={address ? "/earn?address" : "/earn"}
      titleParams={[address ? formatAddress(address) : undefined]}
    />
  );
};
