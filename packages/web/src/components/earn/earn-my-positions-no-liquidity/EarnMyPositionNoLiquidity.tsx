import IconNoPosition from "@components/common/icons/IconNoPosition";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useTokenData } from "@hooks/token/use-token-data";
import { AccountModel } from "@models/account/account-model";
import { useGetTokenPrices } from "@query/token";
import { convertToKMB } from "@utils/stake-position-utils";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NoLiquidityWrapper } from "./EarnMyPositionNoLiquidity.styles";

interface EarnMyPositionNoLiquidityProps {
  account: AccountModel | null;
  highestApr: number;
}

const EarnMyPositionNoLiquidity: React.FC<EarnMyPositionNoLiquidityProps> = ({
  highestApr,
}) => {
  const { t } = useTranslation();
  const { balances: balancesPrice } = useTokenData();
  const { data: tokenPrices = {} } = useGetTokenPrices();
  const availableBalance = useMemo(() => {
    return Object.entries(balancesPrice).reduce((acc, [key, value]) => {
      const path = key === "gnot" ? WRAPPED_GNOT_PATH : key;
      const balance =
        BigNumber(value || 0)
          .multipliedBy(tokenPrices?.[path]?.pricesBefore?.latestPrice || 0)
          .dividedBy(10 ** 6)
          .toNumber() || 0;
      return BigNumber(acc).plus(balance).toNumber();
    }, 0);
  }, [balancesPrice, tokenPrices]);
  const isInterger = Number.isInteger(Number(availableBalance));
  const converted = `$${convertToKMB(`${availableBalance}`, {
    maximumFractionDigits: isInterger ? 0 : 2,
    minimumFractionDigits: isInterger ? 0 : 2,
  }).toString()}`;
  // TODO : Added Recoil OR Props

  return (
    <NoLiquidityWrapper>
      <IconNoPosition className="icon-no-position" />
      <p
        dangerouslySetInnerHTML={{
          __html: t("Earn:positions.noliqui.lineOne", {
            converted,
            apr: BigNumber(highestApr).toFormat(0),
          }),
        }}
      />
      <span className="description">{t("Earn:positions.noliqui.lineTwo")}</span>
    </NoLiquidityWrapper>
  );
};

export default EarnMyPositionNoLiquidity;
