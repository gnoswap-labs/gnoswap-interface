import React from "react";
import { Trans, useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { DcaOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";
import { formatOrderFullAmount } from "@utils/order-format-utils";

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

/** The per-round DCA terms, actual total deposit, and current market price. */
const DcaOrderSentence: React.FC<DcaOrderSentenceProps> = ({ summary }) => {
  const { t } = useTranslation();
  const { inputToken, outputToken } = summary;
  const totalAmount = formatOrderFullAmount(summary.actualSellAmount ?? summary.sellAmount, inputToken.decimals);

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
            total: <TokenLabel key="total" token={inputToken} amount={totalAmount} />,
            hl: <span key="hl" className="highlight" />,
          }}
        />
      </div>
      <div className="market-price">
        {t("Swap:dca.marketPrice")}: {summary.rate} ({summary.rateUsd})
      </div>
    </DcaOrderSentenceWrapper>
  );
};

export default DcaOrderSentence;
