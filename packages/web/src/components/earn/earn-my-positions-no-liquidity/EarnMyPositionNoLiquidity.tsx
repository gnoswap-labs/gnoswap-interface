import IconNoPosition from "@components/common/icons/IconNoPosition";
import { NoLiquidityWrapper } from "./EarnMyPositionNoLiquidity.styles";
import { AccountModel } from "@models/account/account-model";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { GNOT_TOKEN } from "@common/values/token-constant";

interface EarnMyPositionNoLiquidityProps {
  account: AccountModel | null;
}

const EarnMyPositionNoLiquidity: React.FC<
  EarnMyPositionNoLiquidityProps
> = ({ account }) => {
  const balanceText = `$${makeDisplayTokenAmount(GNOT_TOKEN, account?.balances[0].amount || 0)}`;
  // TODO : Added Recoil OR Props
  const apr = "999%";
  
  return (
    <NoLiquidityWrapper>
      <IconNoPosition className="icon-no-position"/>
      <p>
        You have <span className="emphasis-text">&nbsp;{balanceText}&nbsp;</span> in
        your wallet available to earn rewards up to
        <span className="emphasis-text">&nbsp;{apr}&nbsp;</span> APR.
      </p>
      <span className="description">
        Create new positions to earn trading fees and stake your positions to earn staking rewards.
      </span>
    </NoLiquidityWrapper>
  );
};

export default EarnMyPositionNoLiquidity;
