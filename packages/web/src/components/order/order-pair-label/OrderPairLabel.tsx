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
  /** Gnoscan link of the order, shown as an external link icon. */
  linkUrl?: string;
  logoSize?: number;
}

/** `[logo] GNS → GNOT [link]`, the heading of an order. */
const OrderPairLabel: React.FC<OrderPairLabelProps> = ({ inputToken, outputToken, linkUrl, logoSize = 20 }) => {
  return (
    <OrderPairLabelWrapper>
      <MissingLogo symbol={inputToken.symbol} url={inputToken.logoURI} width={logoSize} mobileWidth={16} />
      <span className="pair-symbols">
        {inputToken.displaySymbol || inputToken.symbol}
        <IconRightArrow className="pair-arrow" />
        {outputToken.displaySymbol || outputToken.symbol}
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
