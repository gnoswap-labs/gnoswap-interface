import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { TokenModel } from "@models/token/token-model";
import React from "react";
import { BalanceChangeWrapper } from "./BalanceChange.styles";

export interface BalanceChangeProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
}

const BalanceChange: React.FC<BalanceChangeProps> = ({ tokenA, tokenB }) => {
  return (
    <BalanceChangeWrapper>
      <h5>3. Balance Changes</h5>
      <div className="select-position common-bg">
        <div className="table-balance-change">
          <p className="label">Token</p>
          <p className="label">Current Balance</p>
          <p className="label">New Balance</p>
        </div>

        <div className="table-balance-change">
          <p className="value">
            <MissingLogo
              symbol={tokenA?.symbol}
              url={tokenA?.logoURI}
              width={24}
            />{" "}
            {tokenA?.symbol}
          </p>
          <p className="label">100.554</p>
          <p className="label new-balance">65,465.5</p>
        </div>
        <div className="table-balance-change">
          <p className="value">
            <MissingLogo
              symbol={tokenB?.symbol}
              url={tokenB?.logoURI}
              width={24}
            />{" "}
            {tokenB?.symbol}
          </p>
          <p className="label">489,789.1982</p>
          <p className="label new-balance">65,465.5</p>
        </div>
      </div>
    </BalanceChangeWrapper>
  );
};

export default BalanceChange;
