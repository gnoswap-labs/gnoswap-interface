import IconLogoWhite from "@components/common/icons/IconLogoWhite";
import React from "react";
import { SwapLiquidityWrapper } from "./SwapLiquidity.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconAdd from "@components/common/icons/IconAdd";
import {
  LiquidityInfo,
  LIQUIDITY_HEAD,
} from "@containers/swap-liquidity-container/SwapLiquidityContainer";

interface SwapLiquidityProps {
  liquiditys: LiquidityInfo[];
}

const SwapLiquidity: React.FC<SwapLiquidityProps> = ({ liquiditys }) => {
  return (
    <SwapLiquidityWrapper>
      <div className="box-header">
        <div className="coin-pair">
          <div className="gnos-image-wrapper">
            <IconLogoWhite className="coin-logo" />
          </div>
          <div className="gnot-image-wrapper">
            <IconLogoWhite className="coin-logo" />
          </div>
        </div>
        <span>GNOS/GNOT</span>
      </div>
      {liquiditys.length === 0 ? (
        <div className="list-wrap">
          <p>
            No pools available for this pair. You will be the first to <br />
            add liquidity to this pair.
          </p>
          <Button
            text="Create Pool"
            leftIcon={<IconAdd />}
            style={{
              fullWidth: true,
              gap: 8,
              height: 44,
              fontType: "body9",
              hierarchy: ButtonHierarchy.Primary,
            }}
            onClick={() => {}}
          />
        </div>
      ) : (
        <div className="liquidity-list">
          <div className="th">
            {Object.values(LIQUIDITY_HEAD).map((head, idx) => (
              <span
                key={idx}
                className={Object.keys(LIQUIDITY_HEAD)[idx].toLowerCase()}
              >
                {head}
              </span>
            ))}
          </div>
          {liquiditys.map((liquidity, idx) => (
            <div className="fee-info" key={idx}>
              <span className="badge-wrap">
                <div className="badge">{liquidity.feeTier}</div>
              </span>
              <span className="volume">{liquidity.volume}</span>
              <span className="liquidity">{liquidity.liquidity}</span>
              <span className="apr">{liquidity.apr}</span>
            </div>
          ))}
        </div>
      )}
    </SwapLiquidityWrapper>
  );
};

export default SwapLiquidity;
