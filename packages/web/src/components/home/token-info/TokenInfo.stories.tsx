import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenInfo from "./TokenInfo";

export default {
  title: "home/TokenList/TokenInfo",
  component: TokenInfo,
} as ComponentMeta<typeof TokenInfo>;

const Template: ComponentStory<typeof TokenInfo> = args => (
  <TokenInfo {...args} />
);

export const Default = Template.bind({});
Default.args = {
  id: "token_id",
};
