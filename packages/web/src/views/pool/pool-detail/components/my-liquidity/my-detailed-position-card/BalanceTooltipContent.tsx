import React from "react";
import { useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import { formatPoolPairAmount } from "@utils/new-number-utils";

import { BalanceTooltipContentWrapper } from "./BalanceTooltipContent.styles";

export interface PositionBalanceInfo {
  token: TokenModel;
  balance: number;
  balanceUSD: number;
  percent: string;
}

export interface BalanceTooltipContentProps {
  balances: PositionBalanceInfo[];
}

export const BalanceTooltipContent: React.FC<BalanceTooltipContentProps> = ({
  balances,
}) => {
  const { getGnotPath } = useGnotToGnot();
  const { t } = useTranslation();

  return (
    <BalanceTooltipContentWrapper >
      <span className="title">{t("business:balance")}</span>
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
              decimals: balance.token.decimals,
            })}{" "}
            ({balance.percent})
          </span>
        </div>
      ))}
    </BalanceTooltipContentWrapper>
  );
};
