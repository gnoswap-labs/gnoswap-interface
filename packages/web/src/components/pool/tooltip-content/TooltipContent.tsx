import React from "react";
import { ValuesType } from "utility-types";
import { wrapper } from "./TooltipContent.styles";

export const TITLE = {
  COMPOSITION: "Composition",
  CLAIM_REWARDS: "Claim_rewards",
  STAKING_REWARDS_UPPER: "Staking Rewards",
  UNCLAIMABLE: "Unclaimable",
  BALANCE: "Balance",
  TOTAL_REWARDS: "Total_rewards",
  ESTIMATED_APR: "Estimated_apr",
  BEING_UNSTAKED: "Being_unstaked",
} as const;
export type TITLE = ValuesType<typeof TITLE>;

type InfoType = {
  [key in string]: any;
};

interface TooltipContentProps {
  info: InfoType;
}

const CLAIM_CONTENT =
  "*Swap Fees are only claimable when liquidity is unstaked. If you want to claim the swap fees, please unstake your liquidity first.";

const TooltipContent: React.FC<TooltipContentProps> = ({ info }) => {
  console.log(info);
  return (
    <div css={wrapper}>
      {info.content.map((item: any, idx: number) => (
        <>
          {info.type === TITLE.ESTIMATED_APR ? (
            <AprBreakdownComp item={item} key={idx} />
          ) : (
            <div className="inner-wrap" key={idx}>
              <div className="content-title">
                <h3>{item.title}</h3>
                <span className="total-value">{item?.total}</span>
              </div>
              <ul>
                {item.tokens.map((token: any, idx: number) => (
                  <li key={idx}>
                    <img
                      src={token.logoURI}
                      alt="token logo image"
                      className="token-logo"
                    />
                    <span>{token.symbol}</span>
                    {info.type === TITLE.COMPOSITION && (
                      <span>&nbsp;{`(${token.rate})`}</span>
                    )}
                    <span className="amount">{token.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ))}
      {info.type === TITLE.CLAIM_REWARDS && (
        <p className="claim-content">{CLAIM_CONTENT}</p>
      )}
    </div>
  );
};

const AprBreakdownComp = ({ item }: any) => (
  <div className="inner-wrap">
    <div className="content-title">
      <h3>{item.title}</h3>
    </div>
    <ul>
      <li>
        <h5>Swap Fees</h5>
        <span className="amount">{item.swapFees}</span>
      </li>
      <li>
        <h5>Staking Rewards</h5>
        <span className="amount">{item.stakingRewards}</span>
      </li>
    </ul>
  </div>
);

export default TooltipContent;
