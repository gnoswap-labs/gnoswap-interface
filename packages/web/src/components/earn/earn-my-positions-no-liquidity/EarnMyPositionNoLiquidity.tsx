import IconNoPosition from "@components/common/icons/IconNoPosition";
import { NoLiquidityWrapper } from "./EarnMyPositionNoLiquidity.styles";

interface EarnMyPositionNoLiquidityProps {}

const EarnMyPositionNoLiquidity: React.FC<
  EarnMyPositionNoLiquidityProps
> = () => {
  // TODO : Added Recoil OR Props
  const value = "$0";
  const apr = "999%";

  return (
    <NoLiquidityWrapper>
      <IconNoPosition className="icon-no-position"/>
      <p>
        You have <span className="emphasis-text">&nbsp;{value}&nbsp;</span> in
        your wallet available to earn rewards up to{" "}
        <span className="emphasis-text">&nbsp;{apr}&nbsp;</span> APR.
      </p>
      <span className="description">
        Create new positions to earn trading fees and stake your positions to earn staking rewards.
      </span>
    </NoLiquidityWrapper>
  );
};

export default EarnMyPositionNoLiquidity;
