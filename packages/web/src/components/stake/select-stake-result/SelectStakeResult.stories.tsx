import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectStakeResult from "./SelectStakeResult";

export default {
  title: "stake/SelectStakeResult",
  component: SelectStakeResult,
} as ComponentMeta<typeof SelectStakeResult>;

const Template: ComponentStory<typeof SelectStakeResult> = args => (
  <SelectStakeResult {...args} />
);

export const Default = Template.bind({});
Default.args = { checkedList: ["#11111"] };
