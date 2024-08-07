import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import {
  DEFAULT_POOL_ADD_URI,
  getCanScrollUpId,
} from "@constants/common.constant";
import { LinkButton, WalletLayoutWrapper } from "./WalletLayout.styles";

interface WalletLayoutProps {
  header: React.ReactNode;
  balance: React.ReactNode;
  assets: React.ReactNode;
  positions: React.ReactNode;
  footer: React.ReactNode;
}

const WalletLayout: React.FC<WalletLayoutProps> = ({
  header,
  balance,
  assets,
  positions,
  footer,
}) => {
  const { t } = useTranslation();

  return (
    <WalletLayoutWrapper>
      {header}
      <section className="wallet-summary-section">
        <div className="summary-container">
          <h3 className="title-wrapper">{t("business:pageHeader.wallet")}</h3>
          <div>
            <div className="balance-container">{balance}</div>
            <LinkButton>
              <span>{t("Wallet:gotoEarnAdd")}</span>
              <Link href={DEFAULT_POOL_ADD_URI}>
                {t("common:clickHere")}{" "}
                <IconStrokeArrowRight className="link-icon" />
              </Link>
            </LinkButton>
          </div>
        </div>
      </section>
      <div className="background-wrapper" id={getCanScrollUpId("asset-list")}>
        <div className="background"></div>
        <section className="wallet-detail-section">
          <div className="detail-container">
            <div className="assets">{assets}</div>
            <div className="positions">{positions}</div>
          </div>
        </section>
      </div>
      {footer}
    </WalletLayoutWrapper>
  );
};

export default WalletLayout;
