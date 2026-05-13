import React from "react";
import { useAtomValue } from "jotai";
import { Placement } from "@floating-ui/react";

import { XGNS_TOKEN_PATH } from "@constants/environment.constant";
import { useGetTokens } from "@query/token";
import { LaunchpadState } from "@states/index";
import { formatLaunchpadConditionAmount, getLaunchpadConditionSymbol } from "@utils/launchpad-condition-utils";

import IconWarning from "@components/common/icons/IconWarning";
import Tooltip from "@components/common/tooltip/Tooltip";
import { DepositConditionsTooltipWrapper, FloatingContentWrapper } from "./DepositConditionsTooltip.styles";
import { Trans, useTranslation } from "react-i18next";

interface DepositConditionsTooltipProps {
  placement?: Placement;
}

const DepositConditionsTooltip = ({ placement }: DepositConditionsTooltipProps) => {
  const { t } = useTranslation();

  const depositConditions = useAtomValue(LaunchpadState.depositConditions);
  const { data: { tokens = [] } = {} } = useGetTokens();

  const renderConditions = () => {
    return depositConditions.map(condition => {
      const { tokenPath } = condition;
      const tokenSymbol = getLaunchpadConditionSymbol(condition, tokens);
      const displayAmount = formatLaunchpadConditionAmount(condition, tokens);

      return (
        <React.Fragment key={tokenPath}>
          {tokenPath === XGNS_TOKEN_PATH ? (
            <li>
              <Trans
                ns="Launchpad"
                i18nKey={"common.tooltip.conditions.xGNS"}
                values={{ amount: displayAmount }}
                components={{ br: <br /> }}
              />
            </li>
          ) : (
            <li>
              <Trans
                ns="Launchpad"
                i18nKey={"common.tooltip.conditions.token"}
                values={{
                  amount: displayAmount,
                  symbol: tokenSymbol,
                }}
                components={{ br: <br /> }}
              />
            </li>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <DepositConditionsTooltipWrapper>
      <Tooltip
        FloatingContent={
          <FloatingContentWrapper>
            <div className="contents-header">
              <IconWarning />
              <div>{t("Launchpad:common.tooltip.conditions.title")}</div>
            </div>
            <ul className="list-wrapper">
              <li>{t("Launchpad:common.tooltip.conditions.address")}</li>
              {renderConditions()}
            </ul>
          </FloatingContentWrapper>
        }
        placement={placement ?? "top"}
      >
        <IconWarning />
      </Tooltip>
    </DepositConditionsTooltipWrapper>
  );
};

export default DepositConditionsTooltip;
