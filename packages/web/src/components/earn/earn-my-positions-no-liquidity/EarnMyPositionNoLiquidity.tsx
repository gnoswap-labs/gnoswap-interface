import { NoLiquidityWrapper } from "./EarnMyPositionNoLiquidity.styles";

interface EarnMyPositionNoLiquidityProps { }

const EarnMyPositionNoLiquidity: React.FC<
  EarnMyPositionNoLiquidityProps
> = () => {
  // TODO : Added Recoil OR Props
  const value = "$0";
  const apr = "999%";

  return (
    <NoLiquidityWrapper>
      <p>
        You have<span className="emphasis-text">&nbsp;{value}&nbsp;</span>in
        your wallet available to earn.
        <br /> Provide liquidity now to start earning rewards up to
        <span className="emphasis-text">&nbsp;{apr}&nbsp;</span>APR.
      </p>
      <span className="description">
        Add Position to Gnoswap’s pools to earn trading fees on every swap. You
        may also stake LP tokens to earn GNS token rewards.
      </span>
    </NoLiquidityWrapper>
  );
};

export default EarnMyPositionNoLiquidity;
