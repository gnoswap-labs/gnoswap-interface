import React from "react";
import { useAtomValue } from "jotai";
import { Placement } from "@floating-ui/react";

import { LaunchpadState } from "@states/index";

import IconWarning from "@components/common/icons/IconWarning";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  DepositConditionsTooltipWrapper,
  FloatingContentWrapper,
} from "./DepositConditionsTooltip.styles";

interface DepositConditionsTooltipProps {
  placement?: Placement;
}

const DepositConditionsTooltip = ({
  placement,
}: DepositConditionsTooltipProps) => {
  const depositConditions = useAtomValue(LaunchpadState.depositConditions);

  const renderConditions = () => {
    return depositConditions.map((condition, index) => {
      const { tokenPath, leastTokenAmount } = condition;
      const tokenSymbol = tokenPath.split("/").pop();

      return (
        <div key={index}>
          {tokenPath === "gno.land/r/gnoswap/v2/gov/xgns" ? (
            <div>
              At least {leastTokenAmount.toLocaleString()}
              {tokenSymbol} must be staked at <br />
              Governance.
            </div>
          ) : (
            <div>
              At least {leastTokenAmount.toLocaleString()} {tokenSymbol} token
              must be <br />
              available in wallet.
            </div>
          )}
        </div>
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
              <div>Conditions for Participate</div>
            </div>
            <div>Wallet address is not qualifiable.</div>
            {renderConditions()}
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
