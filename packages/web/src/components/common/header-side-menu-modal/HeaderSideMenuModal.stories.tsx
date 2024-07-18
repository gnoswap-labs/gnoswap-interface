import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css, Theme } from "@emotion/react";
import { action } from "@storybook/addon-actions";

import HeaderSideMenuModal from "./HeaderSideMenuModal";

export default {
  title: "common/Header/HeaderSideMenuModal",
  component: HeaderSideMenuModal,
} as ComponentMeta<typeof HeaderSideMenuModal>;

const Template: ComponentStory<typeof HeaderSideMenuModal> = args => (
  <div css={wrapper}>
    <HeaderSideMenuModal {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  onSideMenuToggle: action("onSideMenuToggle"),
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
