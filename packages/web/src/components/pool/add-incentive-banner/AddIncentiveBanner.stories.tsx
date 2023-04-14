import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AddIncentiveBanner from "./AddIncentiveBanner";

export default {
  title: "pool/AddIncentiveBanner",
  component: AddIncentiveBanner,
} as ComponentMeta<typeof AddIncentiveBanner>;

const Template: ComponentStory<typeof AddIncentiveBanner> = args => (
  <AddIncentiveBanner {...args} />
);

export const Default = Template.bind({});
Default.args = {};
