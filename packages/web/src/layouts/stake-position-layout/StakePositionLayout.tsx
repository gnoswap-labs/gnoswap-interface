import React from "react";
import { useTranslation } from "react-i18next";
import { wrapper } from "./StakePositionLayout.styles";

interface StakePositionLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  stakeLiquidity: React.ReactNode;
  footer: React.ReactNode;
}

const StakePositionLayout: React.FC<StakePositionLayoutProps> = ({
  header,
  breadcrumbs,
  stakeLiquidity,
  footer,
}) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      {header}
      <main className="content-wrap">
        <div className="title-container">
          <h3 className="title">{t("business:pageHeader.earn")}</h3>
          <div className="breadcrumbs">{breadcrumbs}</div>
        </div>
        <div className="stake-liquidity-section">{stakeLiquidity}</div>
      </main>
      {footer}
    </div>
  );
};

export default StakePositionLayout;
