import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css, Theme } from "@emotion/react";
import { action } from "@storybook/addon-actions";
import SettingMenuModal from "./SettingMenuModal";

export default {
  title: "swap/SettingMenuModal",
  component: SettingMenuModal,
} as ComponentMeta<typeof SettingMenuModal>;

const Template: ComponentStory<typeof SettingMenuModal> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <SettingMenuModal {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  onSettingMenu: action("onSettingMenu"),
  changeTolerance: action("changeTolerance"),
  resetTolerance: action("resetTolerance"),
  tolerance: "",
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const contentWrap = () => css`
  width: 500px;
`;
