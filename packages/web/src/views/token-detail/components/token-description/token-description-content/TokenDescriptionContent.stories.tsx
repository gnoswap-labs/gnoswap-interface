import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenDescriptionContent from "./TokenDescriptionContent";

export default {
  title: "token/TokenDescriptionContent",
  component: TokenDescriptionContent,
} as ComponentMeta<typeof TokenDescriptionContent>;

const Template: ComponentStory<typeof TokenDescriptionContent> = args => (
  <TokenDescriptionContent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  content: "string",
};
