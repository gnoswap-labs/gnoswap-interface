import React from "react";
import { useTranslation } from "react-i18next";

import IconInbox from "@components/common/icons/IconInbox";
import { AccountModel } from "@models/account/account-model";

import { NoLiquidityWrapper } from "./OtherPositionNoLiquidity.styles";

interface OtherPositionNoLiquidityProps {
  account: AccountModel | null;
}

const OtherPositionNoLiquidity: React.FC<
  OtherPositionNoLiquidityProps
> = () => {
  const { t } = useTranslation();

  return (
    <NoLiquidityWrapper>
      <IconInbox className="icon-no-position" />
      <span className="description">{t("Earn:positions.other.noLiqui")}</span>
    </NoLiquidityWrapper>
  );
};

export default OtherPositionNoLiquidity;
