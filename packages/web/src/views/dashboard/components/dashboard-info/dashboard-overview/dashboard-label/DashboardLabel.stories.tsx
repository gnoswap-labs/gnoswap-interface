import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DashboardLabel from "./DashboardLabel";
import { css, Theme } from "@emotion/react";

export default {
  title: "dashboard/DashboardLabel",
  component: DashboardLabel,
} as ComponentMeta<typeof DashboardLabel>;

const Template: ComponentStory<typeof DashboardLabel> = args => (
  <div css={wrapper}>
    <DashboardLabel {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  tooltip: "The total supply of GNOS tokens is 1,000,000,000 GNOS.",
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
