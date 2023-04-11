import { wrapper } from "./EarnMyPositionNoLiquidity.styles";

interface EarnMyPositionNoLiquidityProps {}

const EarnMyPositionNoLiquidity: React.FC<
  EarnMyPositionNoLiquidityProps
> = () => {
  // TODO : Added Recoil OR Props
  const value = "$1,120.15";
  const apr = "999%";

  return (
    <div css={wrapper}>
      <p>
        You have<span className="emphasis-text">&nbsp;{value}&nbsp;</span>in
        your wallet available to earn.
        <br /> Provide liquidity now to start earning rewards up to
        <span className="emphasis-text">&nbsp;{apr}&nbsp;</span>APR.
      </p>
      <span className="description">
        Add liquidity to Gnoswap’s pools to earn trading fees on every swap. You
        may also stake LP tokens to earn GNOS token rewards.
      </span>
    </div>
  );
};

export default EarnMyPositionNoLiquidity;
