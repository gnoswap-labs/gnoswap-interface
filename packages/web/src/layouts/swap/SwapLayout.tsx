import React from "react";
import { SwapLayoutWrapper } from "./SwapLayout.styles";
import { useTranslation } from "react-i18next";

interface SwapLayoutProps {
  header: React.ReactNode;
  swap: React.ReactNode;
  /** Order list under the swap card, for the DCA and Limit tabs. */
  orders?: React.ReactNode;
  chart: React.ReactNode;
  info: React.ReactNode;
  footer: React.ReactNode;
}

const SwapLayout: React.FC<SwapLayoutProps> = ({ header, swap, orders, chart, info, footer }) => {
  const { t } = useTranslation();

  return (
    <SwapLayoutWrapper>
      {header}
      <div className="swap-section">
        <div className="swap-container">
          <div className="page-name">{t("Swap:header")}</div>
          <div className="right-container">
            <div className="swap">
              {swap}
              {orders}
            </div>
            <div className="data">
              {chart}
              {info}
            </div>
          </div>
        </div>
      </div>
      {footer}
    </SwapLayoutWrapper>
  );
};

export default SwapLayout;
