import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import React from "react";
import { PoolLayoutWrapper } from "./PoolLayout.styles";
import useRouter from "@hooks/common/use-custom-router";
import { useTranslation } from "react-i18next";

interface PoolLayoutProps {
  header: React.ReactNode;
  poolPairInformation: React.ReactNode;
  liquidity: React.ReactNode;
  staking: React.ReactNode;
  footer: React.ReactNode;
  isStaking: boolean;
}

const PoolLayout: React.FC<PoolLayoutProps> = ({
  header,
  poolPairInformation,
  liquidity,
  staking,
  footer,
  isStaking,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const poolPath = router.getPoolPath();

  const onClickIncentivize = () => {
    if (!poolPath) {
      return;
    }
    router.movePageWithPoolPath("POOL_INCENTIVIZE", poolPath);
  };
  return (
    <PoolLayoutWrapper>
      {header}
      <div className="pool-section">
        <div className="summury-container">{poolPairInformation}</div>
        <div className="positions-container">{liquidity}</div>
        <div
          id="staking-container"
          className="staking-container"
        >
          {staking}
          <div className="button">
            <span>
              {isStaking
                ? t("Pool:gotoIncentivizeGuide.boost")
                : t("Pool:gotoIncentivizeGuide.add")}
              &nbsp;
            </span>
            <div className="pointer-wrap" onClick={onClickIncentivize}>
              <span> {t("common:clickHere")}</span>
              <IconStrokeArrowRight className="arrow-icon" />
            </div>
          </div>
        </div>
      </div>
      {footer}
    </PoolLayoutWrapper>
  );
};

export default PoolLayout;
