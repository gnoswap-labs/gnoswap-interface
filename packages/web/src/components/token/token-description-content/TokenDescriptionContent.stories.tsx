import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenDescriptionContent from "./TokenDescriptionContent";
import { descriptionInit } from "@containers/token-description-container/TokenDescriptionContainer";

export default {
  title: "token/TokenDescriptionContent",
  component: TokenDescriptionContent,
} as ComponentMeta<typeof TokenDescriptionContent>;

const Template: ComponentStory<typeof TokenDescriptionContent> = args => (
  <TokenDescriptionContent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  content: descriptionInit.token.description,
};
