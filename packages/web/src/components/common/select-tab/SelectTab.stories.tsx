import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SelectTab from "./SelectTab";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/SelectTab",
  component: SelectTab,
} as ComponentMeta<typeof SelectTab>;

const Template: ComponentStory<typeof SelectTab> = args => (
  <SelectTab {...args} />
);

export const Default = Template.bind({});
Default.args = {
  list: ["All", "Incentivized", "Non-Incentivized"],
};
