import React from "react";
import { TooltipContent } from "./MyPositionCard.styles";
import { PositionBalanceInfo } from "@models/position/info/position-balance-info";
import { makeDisplayTokenAmount } from "@utils/token-utils";

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
          <span className="position">{makeDisplayTokenAmount(balance.token, balance.balance) || 0}</span>
        </div>
      ))}
    </TooltipContent>
  );
};