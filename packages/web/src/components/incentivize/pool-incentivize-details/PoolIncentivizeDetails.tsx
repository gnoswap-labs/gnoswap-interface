import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { makePairName } from "@utils/string-utils";
import React, { useMemo } from "react";
import { wrapper } from "./PoolIncentivizeDetails.styles";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import BigNumber from "bignumber.js";
import { DistributionPeriodDate } from "../pool-incentivize/PoolIncentivize";

interface PoolIncentivizeDetailsProps {
  details: PoolDetailModel;
  startDate?: DistributionPeriodDate;
  period: number;
}

function formatDate(myDate?: DistributionPeriodDate, days?: number): string {
  const utcDate: Date = new Date(Date.UTC(myDate?.year || 0, myDate?.month || 1 - 1, (myDate?.date || 0) + (days || 0), 0, 0, 0));
  const formattedDate: string =
    utcDate.toISOString().replace(/T/, " ").replace(/\..+/, "") + " (UTC)";
  return formattedDate;
}

const PoolIncentivizeDetails: React.FC<PoolIncentivizeDetailsProps> = ({
  details,
  startDate,
  period,
}) => {
  const feeStr = useMemo(() => {
    return BigNumber(details.fee).toString();
  }, [details]);

  return (
    <div css={wrapper}>
      <section>
        <h5 className="section-title">Pool</h5>
        <div className="section-info">
          <DoubleLogo
            left={details.tokenA.logoURI}
            right={details.tokenB.logoURI}
            size={24}
          />
          <span className="pair-symbol">
            {makePairName(details)}
          </span>
          <Badge text={`${feeStr}%`} type={BADGE_TYPE.DARK_DEFAULT} />
        </div>
      </section>
      <section>
        <h5 className="section-title">Total Amount</h5>
        <div className="section-info">
          <img
            src={details.tokenA.logoURI}
            alt="token-logo"
            className="token-logo"
          />
          <span className="total-amount-value">106,208.255 GNOS</span>
        </div>
      </section>
      <section className="period-section">
        <h5 className="section-title">Period</h5>
        <div className="section-info">
          <span className="select-date">
            {formatDate(startDate, 0)}
            <br />- {formatDate(startDate, period)}
          </span>
          <span className="period-desc">
            1,820.5 GNOS will be distributed daily
          </span>
        </div>
      </section>
    </div>
  );
};

export default PoolIncentivizeDetails;
