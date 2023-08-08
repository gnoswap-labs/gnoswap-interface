import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import MobileTokenInfo from "./MobileTokenInfo";
import { css, Theme } from "@emotion/react";
import { createDummyTokenList } from "@containers/token-list-container/TokenListContainer";

export default {
  title: "home/TokenList/MobileTokenInfo",
  component: MobileTokenInfo,
} as ComponentMeta<typeof MobileTokenInfo>;

const Template: ComponentStory<typeof MobileTokenInfo> = args => (
  <div css={wrapper}>
    <MobileTokenInfo {...args} item={createDummyTokenList()[0]} idx={1} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
