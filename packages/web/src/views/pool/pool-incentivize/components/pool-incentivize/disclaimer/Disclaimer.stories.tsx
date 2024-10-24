import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Disclaimer from "./Disclaimer";

export default {
  title: "incentivize/Disclaimer",
  component: Disclaimer,
} as ComponentMeta<typeof Disclaimer>;

const Template: ComponentStory<typeof Disclaimer> = args => (
  <Disclaimer {...args} />
);

export const Default = Template.bind({});
Default.args = {};
