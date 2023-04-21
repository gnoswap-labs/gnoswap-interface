import { CONTENT_TITLE } from "@components/earn-add/earn-add-liquidity/EarnAddLiquidity";
import { FEE_RATE_OPTION } from "@constants/option.constant";
import React from "react";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconInfo from "@components/common/icons/IconInfo";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import Tooltip from "@components/common/tooltip/Tooltip";
import { wrapper } from "./SelectPriceRange.styles";

interface SelectPriceRangeProps {
  data?: any;
  openPriceRange: boolean;
  onClickOpenPriceRange: () => void;
}

const priceRangeInit = [
  {
    title: "Active",
    tooltip:
      "An aggressive price range of [-10% ~ +10%] for higher risks & returns.",
    apr: "999%",
  },
  {
    title: "Passive",
    tooltip:
      "A passive price range of [-50% ~ +100%] for moderate risks & returns.",
    apr: "420%",
  },
  {
    title: "Custom",
  },
];

const SelectPriceRange: React.FC<SelectPriceRangeProps> = ({
  openPriceRange,
  onClickOpenPriceRange,
  data,
}) => {
  return (
    <div css={wrapper}>
      <section className="title-content" onClick={onClickOpenPriceRange}>
        <h5 className="title">{CONTENT_TITLE.PRICE_RANGE}</h5>
        <Badge
          text={data?.fee ?? FEE_RATE_OPTION.FEE_3}
          type={BADGE_TYPE.LINE}
        />
      </section>
      {openPriceRange && (
        <section className="select-price-wrap">
          {priceRangeInit.map((item: any, idx: number) => (
            <div className="price-range-box" key={idx}>
              <strong className="item-title">{item.title}</strong>
              {item.tooltip && (
                <div className="tooltip-wrap">
                  <Tooltip
                    placement="top"
                    FloatingContent={
                      <p className="tooltip-content">{item.tooltip}</p>
                    }
                  >
                    <IconInfo className="tooltip-icon" />
                  </Tooltip>
                </div>
              )}
              {item.apr ? (
                <span className="apr">{item.apr}</span>
              ) : (
                <IconStrokeArrowRight className="arrow-icon" />
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default SelectPriceRange;
