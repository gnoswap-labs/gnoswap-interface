import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RemoveLiquidity from "./RemoveLiquidity";
import RemoveLiquidityContainer from "@containers/remove-liquidity-container/RemoveLiquidityContainer";

export default {
  title: "remove liquidity/RemoveLiquidity",
  component: RemoveLiquidity,
} as ComponentMeta<typeof RemoveLiquidity>;

const Template: ComponentStory<typeof RemoveLiquidity> = () => {
  return <RemoveLiquidityContainer />;
};

export const Default = Template.bind({});
Default.args = {};
