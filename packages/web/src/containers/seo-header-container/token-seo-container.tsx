import React from "react";

import { formatPrice } from "@utils/new-number-utils";

import { BaseSEOContainer } from "./base-seo-container";

interface TokenSEOProps {
  currentPrice?: string | undefined;
  wrappedToken:
    | {
        name?: string;
        symbol?: string;
      }
    | null
    | undefined;
}

export const TokenSEOContainer = ({ currentPrice, wrappedToken }: TokenSEOProps) => {
  const titleParams = React.useMemo(
    () => [currentPrice ? formatPrice(currentPrice) : undefined, wrappedToken?.name, wrappedToken?.symbol],
    [currentPrice, wrappedToken],
  );

  const ogTitleParams = React.useMemo(() => [wrappedToken?.name, wrappedToken?.symbol], [wrappedToken]);

  const descParams = React.useMemo(() => [wrappedToken?.symbol], [wrappedToken]);

  return (
    <BaseSEOContainer path="/token" titleParams={titleParams} ogTitleParams={ogTitleParams} descParams={descParams} />
  );
};
