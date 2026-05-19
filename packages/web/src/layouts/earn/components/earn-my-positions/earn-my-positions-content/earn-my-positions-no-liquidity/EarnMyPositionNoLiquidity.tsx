import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { sanitizeHtml } from "@utils/sanitize-html";

import { GNOT_TOKEN } from "@common/values/token-constant";
import IconNoPosition from "@components/common/icons/IconNoPosition";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { AccountModel } from "@models/account/account-model";
import { useGetAllTokenPrices } from "@query/token";
import { convertToKMB } from "@utils/stake-position-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";

import { NoLiquidityWrapper } from "./EarnMyPositionNoLiquidity.styles";

interface EarnMyPositionNoLiquidityProps {
  account: AccountModel | null;
  highestApr: number;
}

const EarnMyPositionNoLiquidity: React.FC<EarnMyPositionNoLiquidityProps> = ({ highestApr }) => {
  const { t } = useTranslation();
  const { balances: balancesPrice, tokens } = useTokenData();
  const { data: tokenPrices = {} } = useGetAllTokenPrices();
  const availableBalance = useMemo(() => {
    return Object.entries(balancesPrice).reduce((acc, [key, value]) => {
      const path = key === "ugnot" ? WRAPPED_GNOT_PATH : key;
      const token = tokens.find(token => token.priceID === key || token.path === key || token.path === path);
      const displayAmount = token
        ? makeDisplayTokenAmount(token, value || 0) || 0
        : BigNumber(value || 0)
            .shiftedBy(-GNOT_TOKEN.decimals)
            .toNumber();
      const balance =
        BigNumber(displayAmount)
          .multipliedBy(tokenPrices?.[path]?.pricesBefore?.latestPrice || 0)
          .toNumber() || 0;
      return BigNumber(acc).plus(balance).toNumber();
    }, 0);
  }, [balancesPrice, tokenPrices, tokens]);
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
          __html: sanitizeHtml(t("Earn:positions.noliqui.lineOne", {
            converted,
            apr: BigNumber(highestApr).toFormat(0),
          })),
        }}
      />
      <span className="description">{t("Earn:positions.noliqui.lineTwo")}</span>
    </NoLiquidityWrapper>
  );
};

export default EarnMyPositionNoLiquidity;
