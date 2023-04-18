import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import TooltipContent from "./TooltipContent";
import {
  BALANCE,
  BEING_UNSTAKED,
  CLAIM_REWARDS,
  COMPOSITION,
  ESTIMATED_APR,
  TOTAL_REWARDS,
} from "./TooltipContentDummy";
import Tooltip from "@components/common/tooltip/Tooltip";
import Button, { ButtonHierarchy } from "@components/common/button/Button";

export default {
  title: "pool/TooltipContent",
  component: TooltipContent,
} as ComponentMeta<typeof TooltipContent>;

const Template: ComponentStory<typeof TooltipContent> = args => (
  <Tooltip placement="top" FloatingContent={<TooltipContent {...args} />}>
    <Button
      text="Hover"
      style={{
        hierarchy: ButtonHierarchy.Primary,
        height: 48,
        width: 150,
      }}
    />
  </Tooltip>
);

export const CompositionTooltip = Template.bind({});
CompositionTooltip.args = {
  info: COMPOSITION,
};

export const ClaimRewardsTooltip = Template.bind({});
ClaimRewardsTooltip.args = {
  info: CLAIM_REWARDS,
};

export const BalanceTooltip = Template.bind({});
BalanceTooltip.args = {
  info: BALANCE,
};

export const TotalBalanceTooltip = Template.bind({});
TotalBalanceTooltip.args = {
  info: TOTAL_REWARDS,
};

export const EstimatedAprTooltip = Template.bind({});
EstimatedAprTooltip.args = {
  info: ESTIMATED_APR,
};

export const BeingUnstakedTooltip = Template.bind({});
BeingUnstakedTooltip.args = {
  info: BEING_UNSTAKED,
};
