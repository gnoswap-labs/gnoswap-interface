import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenInfo from "./TokenInfo";
import { css, Theme } from "@emotion/react";
import { createDummyTokenList } from "@containers/token-list-container/TokenListContainer";

export default {
  title: "home/TokenList/TokenInfo",
  component: TokenInfo,
} as ComponentMeta<typeof TokenInfo>;

const Template: ComponentStory<typeof TokenInfo> = args => (
  <div css={wrapper}>
    <TokenInfo {...args} item={createDummyTokenList()[0]} idx={1} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
