import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { makePairName } from "@utils/string-utils";
import React from "react";
import { wrapper } from "./PoolIncentivizeDetails.styles";
import { DistributionPeriodDate } from "../pool-incentivize/PoolIncentivize";
import { PoolSelectItemInfo } from "@models/pool/info/pool-select-item-info";
import { TokenModel } from "@models/token/token-model";

interface PoolIncentivizeDetailsProps {
  details: PoolSelectItemInfo | null;
  startDate?: DistributionPeriodDate;
  period: number;
  amount: string;
  token: TokenModel | null;
}

function formatDate(myDate?: DistributionPeriodDate, days?: number): string {
  const utcDate: Date = new Date(Date.UTC(myDate?.year || 0, (myDate?.month || 1) - 1, (myDate?.date || 0) + (days || 0), 0, 0, 0));
  const formattedDate: string =
    utcDate.toISOString().replace(/T/, " ").replace(/\..+/, "") + " (UTC)";
  return formattedDate;
}

const PoolIncentivizeDetails: React.FC<PoolIncentivizeDetailsProps> = ({
  details,
  startDate,
  period,
  amount,
  token,
}) => {
  
  return (
    <div css={wrapper}>
      <section>
        <h5 className="section-title">Pool</h5>
        {details ? <div className="section-info">
          <DoubleLogo
            left={details.tokenA.logoURI}
            right={details.tokenB.logoURI}
            leftSymbol={details.tokenA.symbol}
            rightSymbol={details.tokenB.symbol}
            size={24}
          />
          <span className="pair-symbol">
            {makePairName(details)}
          </span>
          <Badge text="0.3%" type={BADGE_TYPE.DARK_DEFAULT} />
        </div> : <div className="section-info">-</div>}
      </section>
      <section>
        <h5 className="section-title">Total Amount</h5>
        {amount && token ? <div className="section-info">
          <img
            src={token.logoURI}
            alt="token-logo"
            className="token-logo"
          />
          <span className="total-amount-value">{Number(amount).toLocaleString()} {token.symbol}</span>
        </div> : <div className="section-info">-</div>}
      </section>
      <section className="period-section">
        <h5 className="section-title">Period</h5>
        <div className="section-info">
          <span className="select-date">
            {formatDate(startDate, 0)}
            <br />- {formatDate(startDate, period)}
          </span>
          <span className="period-desc">
            {Number((Number(amount || 0) / period).toFixed(2)).toLocaleString()} {token?.symbol} will be distributed daily
          </span>
        </div>
      </section>
    </div>
  );
};

export default PoolIncentivizeDetails;
