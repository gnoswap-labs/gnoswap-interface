import React from "react";
import { TooltipContent } from "./MyPositionCard.styles";
import { PositionBalanceInfo } from "@models/position/info/position-balance-info";
import { prettyNumberFloatInteger } from "@utils/number-utils";

export interface BalanceTooltipContentProps {
  balances: PositionBalanceInfo[];
}

export const BalanceTooltipContent: React.FC<BalanceTooltipContentProps> = ({ balances }) => {
  return (
    <TooltipContent>
      <span className="title">Balance</span>
      {balances.map((balance, index) => (
        <div key={index} className="list">
          <div className="coin-info">
            <img
              src={balance.token.logoURI}
              alt="token logo"
              className="token-logo"
            />
            <span className="position">
              {balance.token.symbol}
            </span>
          </div>
          <span className="position">{prettyNumberFloatInteger(balance.balance || 0)} ({balance.percent})</span>
        </div>
      ))}
    </TooltipContent>
  );
};