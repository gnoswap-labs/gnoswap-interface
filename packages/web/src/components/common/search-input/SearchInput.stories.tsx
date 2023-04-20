import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SearchInput from "./SearchInput";

export default {
  title: "common/SearchInput",
  component: SearchInput,
} as ComponentMeta<typeof SearchInput>;

const Template: ComponentStory<typeof SearchInput> = args => {
  const [value, setValue] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  return <SearchInput {...args} value={value} onChange={onChange} />;
};

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
