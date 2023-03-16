import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import TokenList from "./TokenList";
import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";

export default {
  title: "home/TokenList",
  component: TokenList,
} as ComponentMeta<typeof TokenList>;

const Template: ComponentStory<typeof TokenList> = args => (
  <TokenList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tokenType: TOKEN_TYPE.ALL,
  changeTokenType: action("changeTokenType"),
  search: action("search"),
  tokens: [{ id: "token_id" }],
  currentPage: 0,
  totalPage: 10,
  movePage: action("movePage"),
};
