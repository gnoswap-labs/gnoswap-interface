import { getCanScrollUpId } from "@constants/common.constant";
import React from "react";
import { useTranslation } from "react-i18next";
import { EarnLayoutWrapper } from "./EarnLayout.styles";

interface WalletLayoutProps {
  header: React.ReactNode;
  positions: React.ReactNode;
  incentivizedPools: React.ReactNode;
  poolList: React.ReactNode;
  footer: React.ReactNode;
}

const EarnLayout: React.FC<WalletLayoutProps> = ({
  header,
  positions,
  incentivizedPools,
  poolList,
  footer,
}) => {
  const { t } = useTranslation();

  return (
    <EarnLayoutWrapper>
      {header}
      <section className="earn-section">
        <div className="earn-container">
          <h3 className="earn-title">{t("Earn:header")}</h3>
          <div className="position">{positions}</div>
          <div className="incentivized">{incentivizedPools}</div>
        </div>
      </section>
      <div className="background-wrapper" id={getCanScrollUpId("pool-list")}>
        <div className="background"></div>
        <section className="pools-section">
          <div className="pools-container">
            <div className="pool-list">{poolList}</div>
          </div>
        </section>
      </div>
      {footer}
    </EarnLayoutWrapper>
  );
};

export default EarnLayout;
