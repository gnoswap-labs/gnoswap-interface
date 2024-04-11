import { WRAPPED_GNOT_PATH } from "@common/clients/wallet-client/transaction-messages";
import IconNoPosition from "@components/common/icons/IconNoPosition";
import { useTokenData } from "@hooks/token/use-token-data";
import { AccountModel } from "@models/account/account-model";
import { useGetTokenPrices } from "@query/token";
import { convertToKMB } from "@utils/stake-position-utils";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { NoLiquidityWrapper } from "./EarnMyPositionNoLiquidity.styles";

interface EarnMyPositionNoLiquidityProps {
  account: AccountModel | null;
}

const EarnMyPositionNoLiquidity: React.FC<
  EarnMyPositionNoLiquidityProps
> = ({ }) => {
  const { balances: balancesPrice } = useTokenData();
  const { data: tokenPrices = {} } = useGetTokenPrices();
  const availableBalance = useMemo(() => {
    return  Object.entries(balancesPrice).reduce((acc, [key, value]) => {
      const path = key === "gnot" ? WRAPPED_GNOT_PATH : key;
      const balance = BigNumber(value || 0).multipliedBy(tokenPrices?.[path]?.pricesBefore?.latestPrice || 0).dividedBy(10 ** 6).toNumber() || 0;
      return BigNumber(acc).plus(balance).toNumber();
    }, 0);
  }, [balancesPrice, tokenPrices]);
  const isInterger = Number.isInteger(Number(availableBalance));
  const converted = `$${convertToKMB(`${availableBalance}`, isInterger ? 0 : 2, isInterger ? 0 : 2).toString()}`;
  // TODO : Added Recoil OR Props
  const apr = "999%";
  
  return (
    <NoLiquidityWrapper>
      <IconNoPosition className="icon-no-position"/>
      <p>
        You have<span className="emphasis-text">&nbsp;{converted}&nbsp;</span>in
        your wallet available to earn rewards up to
        <span className="emphasis-text">&nbsp;{apr}&nbsp;</span>APR.
      </p>
      <span className="description">
        Create new positions to earn trading fees and stake your positions to earn staking rewards.
      </span>
    </NoLiquidityWrapper>
  );
};

export default EarnMyPositionNoLiquidity;
