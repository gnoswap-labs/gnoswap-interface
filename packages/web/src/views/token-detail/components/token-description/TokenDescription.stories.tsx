import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenDescription from "./TokenDescription";

export default {
  title: "token/TokenDescription",
  component: TokenDescription,
} as ComponentMeta<typeof TokenDescription>;

const Template: ComponentStory<typeof TokenDescription> = args => (
  <TokenDescription {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tokenName: "Bitcoin",
  tokenSymbol: "BTC",
  content: "description",
  links: {
    Website: "https://gnoswap.io",
    Gnoscan: "https://gnoscan.io/tokens/r/demo/wugnot",
  },
};
