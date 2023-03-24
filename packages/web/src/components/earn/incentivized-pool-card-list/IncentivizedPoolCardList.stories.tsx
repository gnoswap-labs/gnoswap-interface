import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css } from "@emotion/react";
import IncentivizedPoolCardList from "./IncentivizedPoolCardList";
import { poolDummy } from "@components/earn//incentivized-pool-card/incentivized-pool-dummy";

export default {
  title: "earn/IncentivizedPoolCardList",
  component: IncentivizedPoolCardList,
} as ComponentMeta<typeof IncentivizedPoolCardList>;

const Template: ComponentStory<typeof IncentivizedPoolCardList> = args => (
  <div css={wrapper}>
    <IncentivizedPoolCardList {...args} list={poolDummy} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};

const wrapper = css`
  padding: 1rem 0;
`;
