import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { tokenPairSymbolToOneCharacter } from "@utils/string-utils";
import React from "react";
import { CONTENT_TITLE } from "@components/incentivize/pool-incentivize/PoolIncentivize";
import { wrapper } from "./PoolIncentivizeDetails.styles";

interface PoolIncentivizeDetailsProps {
  details: any;
}

const PoolIncentivizeDetails: React.FC<PoolIncentivizeDetailsProps> = ({
  details,
}) => {
  return (
    <div css={wrapper}>
      <section>
        <h5 className="section-title">{CONTENT_TITLE.POOL}</h5>
        <div className="section-info">
          <DoubleLogo
            left={details.tokenPair.token0.tokenLogo}
            right={details.tokenPair.token1.tokenLogo}
            size={24}
          />
          <span className="pair-symbol">
            {tokenPairSymbolToOneCharacter(details.tokenPair)}
          </span>
          <Badge text={details.feeRate} type={BADGE_TYPE.DARK_DEFAULT} />
        </div>
      </section>
      <section>
        <h5 className="section-title">{CONTENT_TITLE.TOTAL_AMOUNT}</h5>
        <div className="section-info">
          <img
            src={details.tokenPair.token0.tokenLogo}
            alt="token-logo"
            className="token-logo"
          />
          <span className="total-amount-value">106,208.255 GNOS</span>
        </div>
      </section>
      <section className="period-section">
        <h5 className="section-title">{CONTENT_TITLE.PERIOD}</h5>
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
