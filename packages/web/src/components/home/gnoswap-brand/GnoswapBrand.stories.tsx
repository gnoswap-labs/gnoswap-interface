import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import GnoswapBrand from "./GnoswapBrand";
import { action } from "@storybook/addon-actions";

export default {
  title: "home/GnoswapBrand",
  component: GnoswapBrand,
} as ComponentMeta<typeof GnoswapBrand>;

const Template: ComponentStory<typeof GnoswapBrand> = args => (
  <GnoswapBrand {...args} />
);

export const Default = Template.bind({});
Default.args = {
  onClickSns: action("onClickSns"),
};
