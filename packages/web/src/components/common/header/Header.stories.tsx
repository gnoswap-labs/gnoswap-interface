import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css, Theme } from "@emotion/react";
import { action } from "@storybook/addon-actions";

import Header from "./Header";
import { RecentdummyToken } from "@containers/header-container/HeaderContainer";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "common/Header",
  component: Header,
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = args => (
  <div css={wrapper}>
    <Header {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  pathname: "/",
  isConnected: true,
  sideMenuToggle: true,
  onSideMenuToggle: action("onSideMenuToggle"),
  searchMenuToggle: true,
  onSearchMenuToggle: action("onSearchMenuToggle"),
  tokens: RecentdummyToken,
  isFetched: true,
  error: null,
  search: action("search"),
  keyword: "",
  breakpoint: DEVICE_TYPE.WEB,
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
