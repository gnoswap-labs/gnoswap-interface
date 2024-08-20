import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectFeeTier from "./SelectFeeTier";
import { action } from "@storybook/addon-actions";

export default {
  title: "pool/pool-add/SelectFeeTier",
  component: SelectFeeTier,
} as ComponentMeta<typeof SelectFeeTier>;

const Template: ComponentStory<typeof SelectFeeTier> = args => (
  <SelectFeeTier {...args} />
);

export const Default = Template.bind({});
Default.args = {
  feeTiers: [],
  selectFeeTier: action("selectFeeTier"),
};
