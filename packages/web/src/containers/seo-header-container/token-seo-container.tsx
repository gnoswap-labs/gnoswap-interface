import React from "react";

import { formatPrice } from "@utils/new-number-utils";
import { getSwapExtensionByWrappedPath } from "@resources/swap-extension";

import { BaseSEOContainer } from "./base-seo-container";

interface TokenSEOProps {
  currentPrice: string | undefined;
  wrappedToken:
    | {
        name?: string;
        path?: string;
        symbol?: string;
        displaySymbol?: string;
      }
    | null
    | undefined;
}

export const TokenSEOContainer = ({ currentPrice, wrappedToken }: TokenSEOProps) => {
  const displaySymbol = React.useMemo(() => {
    const extension = getSwapExtensionByWrappedPath(wrappedToken?.path);
    return extension?.wrappedTokenInfo.displaySymbol ?? wrappedToken?.displaySymbol ?? wrappedToken?.symbol;
  }, [wrappedToken]);

  const titleParams = React.useMemo(
    () => [currentPrice ? formatPrice(currentPrice) : undefined, wrappedToken?.name, displaySymbol],
    [currentPrice, displaySymbol, wrappedToken?.name],
  );

  const ogTitleParams = React.useMemo(() => [wrappedToken?.name, displaySymbol], [displaySymbol, wrappedToken?.name]);

  const descParams = React.useMemo(() => [displaySymbol], [displaySymbol]);

  return (
    <BaseSEOContainer path="/token" titleParams={titleParams} ogTitleParams={ogTitleParams} descParams={descParams} />
  );
};
