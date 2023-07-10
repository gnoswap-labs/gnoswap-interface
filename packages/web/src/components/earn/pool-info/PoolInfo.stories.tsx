import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PoolInfo from "./PoolInfo";
import { css, Theme } from "@emotion/react";
import { dummyPoolList } from "@containers/pool-list-container/PoolListContainer";

export default {
  title: "earn/PoolList/PoolInfo",
  component: PoolInfo,
} as ComponentMeta<typeof PoolInfo>;

const Template: ComponentStory<typeof PoolInfo> = args => (
  <div css={wrapper}>
    <PoolInfo {...args} pool={dummyPoolList[0]} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
