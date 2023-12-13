import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectLiquidityListItem from "./SelectLiquidityListItem";
import { STAKED_OPTION } from "@constants/option.constant";
import { action } from "@storybook/addon-actions";

export default {
  title: "stake/SelectLiquidityListItem",
  component: SelectLiquidityListItem,
} as ComponentMeta<typeof SelectLiquidityListItem>;

const init = {
  pairLogo: [
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  ],
  path: "#11111",
  liquidity: "$145,541.10",
  staked: STAKED_OPTION.UNSTAKED,
};

const Template: ComponentStory<typeof SelectLiquidityListItem> = args => {
  const [checked, setChecked] = useState(false);
  return (
    <SelectLiquidityListItem
      {...args}
      onCheckedItem={() => setChecked(prev => !prev)}
      checkedList={checked ? ["#11111"] : []}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  checkedList: [],
  onCheckedItem: action("onCheckedItem"),
};
