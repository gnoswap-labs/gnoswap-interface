import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import TokenList from "./TokenList";
import { createDummyTokenList } from "@containers/token-list-container/TokenListContainer";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "home/TokenList",
  component: TokenList,
} as ComponentMeta<typeof TokenList>;

const Template: ComponentStory<typeof TokenList> = args => (
  <TokenList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tokens: createDummyTokenList(),
  isFetched: true,
  changeTokenType: action("changeTokenType"),
  search: action("search"),
  currentPage: 0,
  totalPage: 10,
  movePage: action("movePage"),
  breakpoint: DEVICE_TYPE.WEB,
};
