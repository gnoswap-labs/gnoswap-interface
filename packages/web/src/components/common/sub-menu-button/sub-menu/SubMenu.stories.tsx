import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css, Theme } from "@emotion/react";
import { action } from "@storybook/addon-actions";

import SubMenu from "./SubMenu";

export default {
  title: "common/Header/SubMenu",
  component: SubMenu,
} as ComponentMeta<typeof SubMenu>;

const Template: ComponentStory<typeof SubMenu> = args => (
  <div css={wrapper}>
    <SubMenu {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  onSideMenuToggle: action("onSideMenuToggle"),
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
