import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenListTable from "./TokenListTable";
import { createDummyTokenList } from "@containers/token-list-container/TokenListContainer";

export default {
  title: "home/TokenList/TokenListTable",
  component: TokenListTable,
} as ComponentMeta<typeof TokenListTable>;

const Template: ComponentStory<typeof TokenListTable> = args => (
  <TokenListTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tokens: createDummyTokenList(),
  isFetched: true,
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  tokens: [],
  isFetched: false,
};

export const NotFount = Template.bind({});
NotFount.args = {
  tokens: [],
  isFetched: true,
};
