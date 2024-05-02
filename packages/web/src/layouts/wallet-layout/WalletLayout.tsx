import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import React from "react";
import { LinkButton, WalletLayoutWrapper } from "./WalletLayout.styles";
import Link from "next/link";

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
}) => (
  <WalletLayoutWrapper>
    {header}
    <section className="wallet-summary-section">
      <div className="summary-container">
        <h3 className="title-wrapper">Wallet</h3>
        <div>
          <div className="balance-container">{balance}</div>
          <LinkButton>
            <span>Create a position to start earning rewards</span>
            <Link href="/earn/add?tokenA=gnot&tokenB=gno.land/r/demo/gns&fee_tier=3000">
              Click here <IconStrokeArrowRight className="link-icon" />
            </Link>
          </LinkButton>
        </div>
      </div>
    </section>
    <div className="background-wrapper">
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

export default WalletLayout;
