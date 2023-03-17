import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenListTable from "./TokenListTable";

export default {
  title: "home/TokenList/TokenListTable",
  component: TokenListTable,
} as ComponentMeta<typeof TokenListTable>;

const Template: ComponentStory<typeof TokenListTable> = args => (
  <TokenListTable {...args} />
);

export const Default = Template.bind({});
Default.args = {};
