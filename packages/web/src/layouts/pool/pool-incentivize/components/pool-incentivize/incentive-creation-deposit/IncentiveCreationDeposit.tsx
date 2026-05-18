import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";

import { GNS_TOKEN } from "@common/values/token-constant";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { GNS_TOKEN_PATH } from "@constants/environment.constant";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT, useGetIncentiveCreationDeposit } from "@query/pools";
import { makeDisplayTokenAmount } from "@utils/token-utils";

import {
  IncentiveCreationDepositTooltipContent,
  IncentiveCreationDepositWrapper,
} from "./IncentiveCreationDeposit.styles";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";

const IncentiveCreationDeposit: React.FC = () => {
  const { t } = useTranslation();
  const { tokens } = useTokenData();
  const theme = useTheme();
  const { data: depositGnsAmount = DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT } = useGetIncentiveCreationDeposit();

  const gnsInfo = tokens.find(item => item.path === GNS_TOKEN_PATH);
  const displayDepositAmount = makeDisplayTokenAmount(GNS_TOKEN, depositGnsAmount) || 0;

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
        <MissingLogo symbol={gnsInfo?.symbol || ""} url={gnsInfo?.logoURI} width={24} mobileWidth={24} />
        {displayDepositAmount.toLocaleString("en")}
      </div>
    </IncentiveCreationDepositWrapper>
  );
};

export default IncentiveCreationDeposit;
