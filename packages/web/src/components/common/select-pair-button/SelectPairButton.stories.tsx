import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SelectPairButton from "./SelectPairButton";

export default {
  title: "common/AddLiquidity/SelectPairButton",
  component: SelectPairButton,
} as ComponentMeta<typeof SelectPairButton>;

const Template: ComponentStory<typeof SelectPairButton> = args => (
  <SelectPairButton {...args} />
);

export const Selected = Template.bind({});
Selected.args = {
  token: {
    tokenId: Math.floor(Math.random() * 50 + 1).toString(),
    name: "HEX",
    symbol: "HEX",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  },
};

export const UnSelected = Template.bind({});
UnSelected.args = {
  token: null,
};
