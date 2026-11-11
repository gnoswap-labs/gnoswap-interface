import Link from "next/link";
import React from "react";

import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconRightArrow from "@components/common/icons/IconRightArrow";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { TokenModel } from "@models/token/token-model";

import { OrderPairLabelWrapper } from "./OrderPairLabel.styles";

interface OrderPairLabelProps {
  inputToken: TokenModel;
  outputToken: TokenModel;
  /** Formatted input amount shown before the input symbol. */
  inputAmount?: string;
  /** Formatted expected output before slippage, when known. */
  outputAmount?: string;
  /** Gnoscan link of the order, shown as an external link icon. */
  linkUrl?: string;
  logoSize?: number;
}

/** `[logo] (amount) GNS → GNOT [link]`, the heading of an order. */
const OrderPairLabel: React.FC<OrderPairLabelProps> = ({
  inputToken,
  outputToken,
  inputAmount,
  outputAmount,
  linkUrl,
  logoSize = 20,
}) => {
  const inputSymbol = inputToken.displaySymbol || inputToken.symbol;
  const outputSymbol = outputToken.displaySymbol || outputToken.symbol;

  return (
    <OrderPairLabelWrapper>
      <MissingLogo symbol={inputToken.symbol} url={inputToken.logoURI} width={logoSize} mobileWidth={16} />
      <span className="pair-symbols">
        <span className="pair-token">
          <span className="pair-token-text">{inputAmount ? `${inputAmount} ${inputSymbol}` : inputSymbol}</span>
        </span>
        <IconRightArrow className="pair-arrow" />
        <span className="pair-token">
          {outputAmount !== undefined && (
            <MissingLogo symbol={outputToken.symbol} url={outputToken.logoURI} width={logoSize} mobileWidth={16} />
          )}
          <span className="pair-token-text">
            {outputAmount !== undefined ? `${outputAmount} ${outputSymbol}` : outputSymbol}
          </span>
        </span>
      </span>
      {linkUrl && (
        <Link className="pair-link" href={linkUrl} target="_blank" aria-label="Order transaction link">
          <IconOpenLink size="12px" className="path-link-icon" />
        </Link>
      )}
    </OrderPairLabelWrapper>
  );
};

export default OrderPairLabel;
