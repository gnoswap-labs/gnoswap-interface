import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import React from "react";
import { LinkButton, WalletLayoutWrapper } from "./WalletLayout.styles";
import Link from "next/link";
import { getCanScrollUpId } from "@constants/common.constant";
import { useTranslation } from "react-i18next";

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
              <Link href="/earn/add?tokenA=gnot&tokenB=gno.land/r/gnoswap/gns&fee_tier=3000">
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
