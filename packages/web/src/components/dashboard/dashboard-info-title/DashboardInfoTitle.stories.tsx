import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DashboardInfoTitle from "./DashboardInfoTitle";
import { css, Theme } from "@emotion/react";

export default {
  title: "dashboard/DashboardInfoTitle",
  component: DashboardInfoTitle,
} as ComponentMeta<typeof DashboardInfoTitle>;

const Template: ComponentStory<typeof DashboardInfoTitle> = args => (
  <div css={wrapper}>
    <DashboardInfoTitle {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  dashboardTokenInfo: {
    gnosAmount: "$0.7425",
    gnotAmount: "$1.8852",
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
