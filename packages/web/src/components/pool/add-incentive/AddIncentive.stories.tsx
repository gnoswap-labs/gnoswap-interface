import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AddIncentive from "./AddIncentive";

export default {
  title: "pool/AddIncentive",
  component: AddIncentive,
} as ComponentMeta<typeof AddIncentive>;

const Template: ComponentStory<typeof AddIncentive> = args => (
  <AddIncentive {...args} />
);

export const Default = Template.bind({});
Default.args = {};
