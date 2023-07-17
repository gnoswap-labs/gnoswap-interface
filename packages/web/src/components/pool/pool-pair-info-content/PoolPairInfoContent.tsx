import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import React from "react";
import { wrapper } from "./PoolPairInfoContent.styles";
import { cx } from "@emotion/css";
import Tooltip from "@components/common/tooltip/Tooltip";

interface PoolPairInfoContentProps {
  content: any;
}

const PoolPairInfoContent: React.FC<PoolPairInfoContentProps> = ({
  content,
}) => {
  const { liquidity, volume24h, apr } = content;

  return (
    <div css={wrapper}>
      <section>
        <h4 className="label-info">Liquidity</h4>
        <Tooltip placement="top" FloatingContent={<div>TODO...</div>}>
          <strong className="has-tooltip">{liquidity.value}</strong>
        </Tooltip>
        <div className="sub-info-wrap">
          <span className="label-info">24h Change</span>
          <span
            className={cx("status-type", {
              negative:
                liquidity.change24h.status === MATH_NEGATIVE_TYPE.NEGATIVE,
            })}
          >
            {liquidity.change24h.value}
          </span>
        </div>
      </section>

      <section>
        <h4 className="label-info">Volume (24h)</h4>
        <strong>{volume24h.value}</strong>
        <div className="sub-info-wrap">
          <span className="label-info">24h Change</span>
          <span
            className={cx("status-type", {
              negative:
                liquidity.change24h.status === MATH_NEGATIVE_TYPE.NEGATIVE,
            })}
          >
            {volume24h.change24h.value}
          </span>
        </div>
      </section>

      <section>
        <h4 className="label-info">APR</h4>
        <strong>{apr.value}</strong>
        <div className="sub-info-wrap">
          <div className="apr-inner-box">
            <span className="label-info">Fees</span>
            <span className="apr-value">{apr.fees}</span>
          </div>
          <div className="apr-inner-box">
            <span className="label-info">Rewards</span>
            <span className="apr-value">{apr.rewards}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PoolPairInfoContent;
