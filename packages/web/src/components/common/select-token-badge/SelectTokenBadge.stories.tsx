import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SelectTokenBadge from "./SelectTokenBadge";

export default {
  title: "common/SelectTokenBadge",
  component: SelectTokenBadge,
} as ComponentMeta<typeof SelectTokenBadge>;

const dummyData = {
  tokenLogo:
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  symbol: "HEX",
};

const Template: ComponentStory<typeof SelectTokenBadge> = args => (
  <SelectTokenBadge {...args} />
);

export const Selectable = Template.bind({});
Selectable.args = {
  token: dummyData,
  hasArrow: false,
  isSelectable: true,
  onClick: () => {},
};

export const Unselectable = Template.bind({});
Unselectable.args = {
  token: dummyData,
  hasArrow: false,
  isSelectable: false,
  onClick: () => {},
};

export const SelectableWithArrow = Template.bind({});
SelectableWithArrow.args = {
  token: dummyData,
  hasArrow: true,
  isSelectable: true,
  onClick: () => {},
};
