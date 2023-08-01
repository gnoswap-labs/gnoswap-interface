import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css, Theme } from "@emotion/react";
import { action } from "@storybook/addon-actions";

import SearchMenuModal from "./SearchMenuModal";
import {
  RecentdummyToken,
  PopulardummyToken,
} from "@containers/header-container/HeaderContainer";

export default {
  title: "common/Header/SearchMenuModal",
  component: SearchMenuModal,
} as ComponentMeta<typeof SearchMenuModal>;

const Template: ComponentStory<typeof SearchMenuModal> = args => (
  <div css={wrapper}>
    <SearchMenuModal {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  onSearchMenuToggle: action("onSearchMenuToggle"),
  search: action("search"),
  keyword: "",
  isFetched: true,
  placeholder: "Search",
  tokens: [...RecentdummyToken, ...PopulardummyToken],
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
