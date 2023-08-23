import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import TokenListHeader from "./TokenListHeader";
import { TOKEN_TYPE } from "@containers/token-list-container/TokenListContainer";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "home/TokenList/TokenListHeader",
  component: TokenListHeader,
} as ComponentMeta<typeof TokenListHeader>;

const Template: ComponentStory<typeof TokenListHeader> = args => (
  <TokenListHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tokenType: TOKEN_TYPE.ALL,
  changeTokenType: action("changeTokenType"),
  search: action("search"),
  breakpoint: DEVICE_TYPE.WEB,
  keyword: "",
  searchIcon: true,
  onTogleSearch: action("onTogleSearch"),
};
