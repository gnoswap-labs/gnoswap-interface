import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { makePairName } from "@utils/string-utils";
import React, { useMemo } from "react";
import { wrapper } from "./PoolIncentivizeDetails.styles";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import BigNumber from "bignumber.js";

interface PoolIncentivizeDetailsProps {
  details: PoolDetailModel;
}

const PoolIncentivizeDetails: React.FC<PoolIncentivizeDetailsProps> = ({
  details,
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
          <Badge text={feeStr} type={BADGE_TYPE.DARK_DEFAULT} />
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
            2022-12-06 00:00 (UTC)
            <br />- 2023-01-05 00:00 (UTC)
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
