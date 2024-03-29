import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import React from "react";
import { PoolLayoutWrapper } from "./PoolLayout.styles";
import { useRouter } from "next/router";

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
  const onClickIncentivize = () => {
    router.push(`/earn/pool/${router.query["pool-path"]}/incentivize`);
  };
  return (
    <PoolLayoutWrapper>
      {header}
      <div className="pool-section">
        <div className="summury-container">{poolPairInformation}</div>
        <div id="positions-container" className="positions-container">{liquidity}</div>
        <div className="staking-container" style={{ marginTop: !isStaking ? "-44px" : "0" }}>
          {staking}
          <div className="button">
            <span>Want to {isStaking ? "boost" : "add"} up incentives for this pool?&nbsp;</span>
            <div className="pointer-wrap" onClick={onClickIncentivize}>
              <span> Click here</span>
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
