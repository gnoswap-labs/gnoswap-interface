import { css, Theme } from "@emotion/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { dummyActivityData } from "@repositories/activity/responses/activity-responses";

import ActivityInfo from "./ActivityInfo";

export default {
  title: "dashboard/ActivityInfo",
  component: ActivityInfo,
} as ComponentMeta<typeof ActivityInfo>;

const Template: ComponentStory<typeof ActivityInfo> = args => (
  <div css={wrapper}>
    <ActivityInfo {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  item: dummyActivityData,
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
