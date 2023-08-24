import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapLiquidity from "./SwapLiquidity";
import { dummyLiquidityList } from "@containers/swap-liquidity-container/SwapLiquidityContainer";
import { css } from "@emotion/react";

export default {
  title: "swap/SwapLiquidity",
  component: SwapLiquidity,
} as ComponentMeta<typeof SwapLiquidity>;

const Template: ComponentStory<typeof SwapLiquidity> = args => (
  <div css={wrapper}>
    <div>
      <SwapLiquidity {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  liquiditys: dummyLiquidityList,
};

export const NoLiquidity = Template.bind({});
NoLiquidity.args = {
  liquiditys: [],
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;
