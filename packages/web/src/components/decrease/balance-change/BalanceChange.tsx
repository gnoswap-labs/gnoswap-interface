import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { IPooledTokenInfo } from "@hooks/decrease/use-decrease-handle";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import React from "react";
import { useTranslation } from "react-i18next";
import { BalanceChangeWrapper } from "./BalanceChange.styles";

export interface BalanceChangeProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  title?: string;
  pooledTokenInfos: IPooledTokenInfo | null;
}

const BalanceChange: React.FC<BalanceChangeProps> = ({
  tokenA,
  tokenB,
  title = "3. Balance Changes",
  pooledTokenInfos,
}) => {
  const { t } = useTranslation();

  return (
    <BalanceChangeWrapper>
      <h5>{title}</h5>
      <div className="select-position common-bg">
        <div className="table-balance-change">
          <p className="label">{t("business:token")}</p>
          <p className="label">{t("common:balanceChange.currentBalance")}</p>
          <p className="label">{t("common:balanceChange.newBalance")}</p>
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
          <p className="label">
            {BigNumber(pooledTokenInfos?.tokenABalance ?? 0).toFormat()}
          </p>
          <p className="label new-balance">
            {BigNumber(pooledTokenInfos?.tokenARemainingAmount ?? 0).toFormat()}
          </p>
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
          <p className="label">
            {BigNumber(pooledTokenInfos?.tokenBBalance ?? 0).toFormat()}
          </p>
          <p className="label new-balance">
            {BigNumber(pooledTokenInfos?.tokenBRemainingAmount ?? 0).toFormat()}
          </p>
        </div>
      </div>
    </BalanceChangeWrapper>
  );
};

export default BalanceChange;
