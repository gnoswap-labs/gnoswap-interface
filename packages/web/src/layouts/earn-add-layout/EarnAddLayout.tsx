import React from "react";
import { wrapper } from "./EarnAddLayout.styles";

interface EarnAddLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  addLiquidity: React.ReactNode;
  oneStaking: React.ReactNode;
  exchangeRateGraph: React.ReactNode;
  footer: React.ReactNode;
}

const EarnAddLayout: React.FC<EarnAddLayoutProps> = ({
  header,
  breadcrumbs,
  addLiquidity,
  oneStaking,
  footer,
  exchangeRateGraph,
}) => {
  return (
    <div css={wrapper}>
      {header}
      <main className="content-wrap">
        <div className="title-container">
          <h3 className="title">Earn</h3>
          <div className="breadcrumbs">{breadcrumbs}</div>
        </div>
        <div className={`wrapper-sub-content ${(!oneStaking && !exchangeRateGraph) && "full-width"}`}>
          <div className="add-liquidity-section">{addLiquidity}</div>
          <div className="additional-info-section">
            <div className={`one-click-staking ${(oneStaking && exchangeRateGraph) ? "margin-bottom" : ""}`}>{oneStaking ? oneStaking : <div className="fake-div"></div>}</div>
            <div className="exchange-rate-graph">{exchangeRateGraph}</div>
          </div>
        </div>
      </main>
      {footer}
    </div>
  );
};

export default EarnAddLayout;
