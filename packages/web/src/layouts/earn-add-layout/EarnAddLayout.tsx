import React from "react";
import { wrapper } from "./EarnAddLayout.styles";

interface EarnAddLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  addLiquidity: React.ReactNode;
  footer: React.ReactNode;
}

const EarnAddLayout: React.FC<EarnAddLayoutProps> = ({
  header,
  breadcrumbs,
  addLiquidity,
  footer,
}) => {
  return (
    <div css={wrapper}>
      {header}
      <main className="content-wrap">
        <div className="title-container">
          <h3 className="title">Earn</h3>
          <div className="breadcrumbs">{breadcrumbs}</div>
        </div>
        <div className="add-liquidity-section">{addLiquidity}</div>
      </main>
      {footer}
    </div>
  );
};

export default EarnAddLayout;
