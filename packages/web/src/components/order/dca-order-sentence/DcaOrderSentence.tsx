import React from "react";
import { Trans, useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { DcaOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";

import { DcaOrderSentenceWrapper } from "./DcaOrderSentence.styles";

interface DcaOrderSentenceProps {
  summary: DcaOrderSummary;
}

const TokenLabel: React.FC<{ token: TokenModel; amount?: string }> = ({ token, amount }) => (
  <span className="token-label">
    {amount && <span className="highlight">{amount}</span>}
    <MissingLogo symbol={token.symbol} url={token.logoURI} width={16} mobileWidth={14} />
    <span className="highlight">{token.displaySymbol}</span>
  </span>
);

/** `You're selling 1 GNOT to buy GNS at market price every 1 minute for 1,000 rounds.` and the market price. */
const DcaOrderSentence: React.FC<DcaOrderSentenceProps> = ({ summary }) => {
  const { t } = useTranslation();
  const { inputToken, outputToken } = summary;

  return (
    <DcaOrderSentenceWrapper>
      <div className="sentence">
        <Trans
          i18nKey="Swap:dca.orderSentence"
          values={{
            interval: t(`Swap:dca.intervalPhrase.${summary.intervalUnit}`),
            rounds: summary.executionCount.toLocaleString("en-US"),
          }}
          components={{
            sell: <TokenLabel key="sell" token={inputToken} amount={summary.amountPerOrder} />,
            buy: <TokenLabel key="buy" token={outputToken} />,
            hl: <span key="hl" className="highlight" />,
          }}
        />
      </div>
      <div className="market-price">
        {t("Swap:dca.marketPrice")}: <span className="highlight">{summary.rate}</span>{" "}
        <span>({summary.rateUsd})</span>
      </div>
    </DcaOrderSentenceWrapper>
  );
};

export default DcaOrderSentence;
