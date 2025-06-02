import React from "react";
import Link from "next/link";

import { EXT_URL } from "@constants/external-url.contant";

import * as S from "./PriceWarning.styles";
import IconPriceWarning from "../icons/IconPriceWarning";
import Tooltip from "../tooltip/Tooltip";

const PRICE_TOOLTIP_CONTENT = (
  <>
    <b>Informational Price:</b> This price does not meet our internal TWAP standards and is shown for informational
    purposes only. Please reference it with caution.{" "}
    <Link href={EXT_URL.DOCS.TWAP} target="_blank">
      Learn more
    </Link>
  </>
);

const TVL_TOOLTIP_CONTENT = (
  <>
    <b>Informational TVL:</b> This TVL does not meet our internal liquidity/TWAP standards and is shown for
    informational purposes only. Please reference it with caution.{" "}
    <Link href={EXT_URL.DOCS.TWAP} target={"_blank"}>
      Learn more
    </Link>
  </>
);

interface PriceWarningProps {
  type: "PRICE" | "TVL";
}

const PriceWarning = ({ type }: PriceWarningProps) => {
  const displayTooltipContent = React.useMemo(() => {
    if (type === "PRICE") return PRICE_TOOLTIP_CONTENT;
    return TVL_TOOLTIP_CONTENT;
  }, [type]);

  return (
    <div>
      <Tooltip
        FloatingContent={
          <S.TooltipFloatingContentWrapper onClick={e => e.stopPropagation()}>
            {displayTooltipContent}
          </S.TooltipFloatingContentWrapper>
        }
        placement="top"
      >
        <IconPriceWarning className="price-warning-icon" />
      </Tooltip>
    </div>
  );
};

export default PriceWarning;
