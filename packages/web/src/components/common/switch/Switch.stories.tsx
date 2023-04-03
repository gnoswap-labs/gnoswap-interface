import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Switch from "./Switch";

export default {
  title: "common/Switch",
  component: Switch,
  argTypes: { disabled: { control: "boolean" } },
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = args => {
  const [checked, setChecked] = useState(false);
  const onChange = () => setChecked((prev: boolean) => !prev);
  return <Switch {...args} checked={checked} onChange={onChange} />;
};

export const Default = Template.bind({});
Default.args = {
  hasLabel: true,
  labelText: "Hide zero balances",
  disabled: false,
};
