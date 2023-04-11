import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenDescription from "./TokenDescription";
import { descriptionInit } from "@containers/token-description-container/TokenDescriptionContainer";

export default {
  title: "token/TokenDescription",
  component: TokenDescription,
} as ComponentMeta<typeof TokenDescription>;

const Template: ComponentStory<typeof TokenDescription> = args => (
  <TokenDescription {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tokenName: descriptionInit.token.name,
  tokenSymbol: descriptionInit.token.symbol,
  content: descriptionInit.desc,
  links: descriptionInit.links,
};
