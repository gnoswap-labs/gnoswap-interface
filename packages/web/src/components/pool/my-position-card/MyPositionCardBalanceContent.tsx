import React from "react";
import { TooltipContent } from "./MyPositionCard.styles";
import { PositionBalanceInfo } from "@models/position/info/position-balance-info";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { formatPoolPairAmount } from "@utils/new-number-utils";

export interface BalanceTooltipContentProps {
  balances: PositionBalanceInfo[];
}

export const BalanceTooltipContent: React.FC<BalanceTooltipContentProps> = ({
  balances,
}) => {
  const { getGnotPath } = useGnotToGnot();

  return (
    <TooltipContent>
      <span className="title">Balance</span>
      {balances.map((balance, index) => (
        <div key={index} className="list">
          <div className="coin-info">
            <MissingLogo
              symbol={getGnotPath(balance.token).symbol}
              url={getGnotPath(balance.token).logoURI}
              className="token-logo"
              width={20}
              mobileWidth={20}
            />
            <span className="position">{balance.token.symbol}</span>
          </div>
          <span className="position">
            {formatPoolPairAmount(balance.balance, {
              isKMB: false,
            })}{" "}
            ({balance.percent})
          </span>
        </div>
      ))}
    </TooltipContent>
  );
};
