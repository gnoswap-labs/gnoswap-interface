import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import StakeLiquidity from "./StakeLiquidity";
import StakeLiquidityContainer from "@containers/stake-liquidity-container/StakeLiquidityContainer";

export default {
  title: "stake/StakeLiquidity",
  component: StakeLiquidity,
} as ComponentMeta<typeof StakeLiquidity>;

const Template: ComponentStory<typeof StakeLiquidity> = () => {
  return <StakeLiquidityContainer />;
};

export const Default = Template.bind({});
Default.args = {};
