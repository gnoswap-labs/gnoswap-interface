import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { GNS_TOKEN_PATH } from "@constants/environment.constant";
import { useTokenData } from "@hooks/token/use-token-data";

import { IncentiveCreationDepositTooltipContent, IncentiveCreationDepositWrapper } from "./IncentiveCreationDeposit.styles";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";

export const GNS_DEPOSIT_AMOUNT = 1_000;

const IncentiveCreationDeposit: React.FC = () => {
  const { t } = useTranslation();
  const {tokens} = useTokenData();
  const theme = useTheme();

  const gnsInfo = tokens.find(item => item.path === GNS_TOKEN_PATH);

  return (
    <IncentiveCreationDepositWrapper>
      <h5 className="section-title">
        {t("IncentivizePool:creationDeposit.title")}
        <Tooltip
          placement="top"
          FloatingContent={
            <IncentiveCreationDepositTooltipContent>
              {t("IncentivizePool:creationDeposit.tooltip")}
            </IncentiveCreationDepositTooltipContent>
          }
        >
          <IconInfo fill={theme.color.icon03} size={16} className="icon-info" />
        </Tooltip>
      </h5>
      <div className="deposit">
        <MissingLogo
          symbol={gnsInfo?.symbol || ""}
          url={gnsInfo?.logoURI}
          width={24}
          mobileWidth={24}
        />
        {GNS_DEPOSIT_AMOUNT.toLocaleString("en")}
      </div>
    </IncentiveCreationDepositWrapper>
  );
};

export default IncentiveCreationDeposit;
