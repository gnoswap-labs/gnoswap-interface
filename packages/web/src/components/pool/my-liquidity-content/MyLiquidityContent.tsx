import React from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import Tooltip from "@components/common/tooltip/Tooltip";
import { wrapper } from "./MyLiquidityContent.styles";

interface MyLiquidityContentProps {
  content: any;
}

const MyLiquidityContent: React.FC<MyLiquidityContentProps> = ({ content }) => {
  const { totalBalance, dailyEarn, claimRewards } = content;
  return (
    <div css={wrapper}>
      <section>
        <h4>Total Balance</h4>
        <span className="content-value">{totalBalance}</span>
      </section>

      <section>
        <h4>Daily Earnings</h4>
        <span className="content-value">{dailyEarn}</span>
      </section>

      <section>
        <h4>Claimable Rewards</h4>
        <div className="claim-wrap">
          <Tooltip placement="top" FloatingContent={<div>TODO...</div>}>
            <span className="content-value has-tooltip">{claimRewards}</span>
          </Tooltip>
          <Button
            text="Claim All"
            style={{
              hierarchy: ButtonHierarchy.Primary,
              height: 36,
              padding: "0px 16px",
              fontType: "p1",
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default MyLiquidityContent;
