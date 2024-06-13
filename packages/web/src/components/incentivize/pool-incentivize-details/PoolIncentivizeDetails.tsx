import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { makePairName } from "@utils/string-utils";
import React from "react";
import { wrapper } from "./PoolIncentivizeDetails.styles";
import { DistributionPeriodDate } from "../pool-incentivize/PoolIncentivize";
import { PoolSelectItemInfo } from "@models/pool/info/pool-select-item-info";
import { TokenModel } from "@models/token/token-model";
import { getDateUtcToLocal } from "@common/utils/date-util";
import DateTimeTooltip from "@components/common/date-time-tooltip/DateTimeTooltip";

interface PoolIncentivizeDetailsProps {
  details: PoolSelectItemInfo | null;
  startDate?: DistributionPeriodDate;
  period: number;
  amount: string;
  token: TokenModel | null;
}

function formatDate(myDate?: DistributionPeriodDate, days?: number): string {
  const utcDate: Date = new Date(Date.UTC(myDate?.year || 0, (myDate?.month || 1) - 1, (myDate?.date || 0) + (days || 0), 0, 0, 0));
  const formattedDate = getDateUtcToLocal(utcDate);
  return formattedDate.value;
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
          <Badge text={`${(Number(details.fee) ?? 0) / 10000}%`} type={BADGE_TYPE.DARK_DEFAULT} />
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
          <DateTimeTooltip>
            <span className="select-date">
              {formatDate(startDate)}
              <br />- {formatDate(startDate, period)}
            </span>
          </DateTimeTooltip>
          <span className="period-desc">
            {Number((Number(amount || 0) / period).toFixed(2)).toLocaleString()} {token?.symbol} will be distributed daily
          </span>
        </div>
      </section>
    </div>
  );
};

export default PoolIncentivizeDetails;