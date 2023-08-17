import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SwapCardHeader from "./SwapCardHeader";
import { css, Theme } from "@emotion/react";

export default {
  title: "swap/SwapCardHeader",
  component: SwapCardHeader,
} as ComponentMeta<typeof SwapCardHeader>;

const Template: ComponentStory<typeof SwapCardHeader> = args => (
  <div css={wrapper}>
    <div css={headerWrap}>
      <SwapCardHeader {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {};

const wrapper = (theme: Theme) => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const headerWrap = (theme: Theme) => css`
  width: 500px;
`;
