import React from "react";
import { IncreaseLiquidityLoadingWrapper } from "./IncreaseLiquidity.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconSettings from "@components/common/icons/IconSettings";

const IncreaseLiquidityLoading: React.FC = () => {
  return (
    <IncreaseLiquidityLoadingWrapper>
      <h3>Increase Liquidity</h3>
      <article>
        <div className="header-wrapper">
          <h5 className="enter-increase-amount">1. Select Position</h5>
        </div>
        <div className="loading-wrapper position">
          <LoadingSpinner />
        </div>
      </article>

      <article>
        <div className="header-wrapper">
          <h5 className="enter-increase-amount">2. Enter Increasing Amount</h5>
          <button
            className="setting-button"
            onClick={() => {
              return;
            }}
          >
            <IconSettings className="setting-icon" />
          </button>
        </div>
        <div className="loading-wrapper amount">
          <LoadingSpinner />
        </div>
      </article>

      <Button
        text={"Enter Amount"}
        style={{
          hierarchy: ButtonHierarchy.Gray,
          fullWidth: true,
        }}
        className="button-confirm"
      />
    </IncreaseLiquidityLoadingWrapper>
  );
};

export default IncreaseLiquidityLoading;
