import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SearchInput from "./SearchInput";

export default {
  title: "common/SearchInput",
  component: SearchInput,
} as ComponentMeta<typeof SearchInput>;

const Template: ComponentStory<typeof SearchInput> = args => (
  <SearchInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
  width: 400,
  height: 48,
  placeholder: "Search Input",
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
  height: 48,
  placeholder: "Full Width",
};
