import React from "react";
import { useTranslation } from "react-i18next";

import Range from "@components/common/range/Range";
import { IPooledTokenInfo } from "@views/pool/pool-decrease-liquidity/hooks/use-decrease-handle";
import { TokenModel } from "@models/token/token-model";

import DecreasePoolInfo from "../decrease-pool-info/DecreasePoolInfo";
import { DecreaseSelectPositionWrapper } from "./DecreaseSelectPosition.styles";

export interface DecreaseSelectPositionProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  percent: number;
  handlePercent: (value: number) => void;
  pooledTokenInfos: IPooledTokenInfo | null;
  isGetWGNOT: boolean;
  setIsGetWGNOT: () => void;
}

const DecreaseAmountPosition: React.FC<DecreaseSelectPositionProps> = ({
  tokenA,
  tokenB,
  percent,
  handlePercent,
  pooledTokenInfos,
  isGetWGNOT,
  setIsGetWGNOT,
}) => {
  const { t } = useTranslation();

  return (
    <DecreaseSelectPositionWrapper>
      <div className="header-wrapper">
        <h5>{t("DecreaseLiquidity:form.decreaseAmount.label")}</h5>
      </div>
      <div className="select-position common-bg decrease-bg">
        <div className="decrease-percent">
          <p>{percent}%</p>
          <div>
            <div className="box-percent" onClick={() => handlePercent(25)}>
              25%
            </div>
            <div className="box-percent" onClick={() => handlePercent(50)}>
              50%
            </div>
            <div className="box-percent" onClick={() => handlePercent(75)}>
              75%
            </div>
            <div className="box-percent" onClick={() => handlePercent(100)}>
              {t("common:max")}
            </div>
          </div>
        </div>
        <div className="range">
          <Range percent={percent} handlePercent={handlePercent} />
        </div>
      </div>
      <DecreasePoolInfo
        tokenA={tokenA}
        tokenB={tokenB}
        pooledTokenInfos={pooledTokenInfos}
        isGetWGNOT={isGetWGNOT}
        setIsGetWGNOT={setIsGetWGNOT}
        displayGnotSwitch
      />
    </DecreaseSelectPositionWrapper>
  );
};

export default DecreaseAmountPosition;
