import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css } from "@emotion/react";
import IncentivizedPoolCardList from "./IncentivizedPoolCardList";
import { poolDummy } from "@components/earn//incentivized-pool-card/incentivized-pool-dummy";
import { action } from "@storybook/addon-actions";

export default {
  title: "earn/IncentivizedPoolCardList",
  component: IncentivizedPoolCardList,
  argTypes: {
    isFetched: {
      options: [true, false],
      control: { type: "boolean" },
    },
  },
} as ComponentMeta<typeof IncentivizedPoolCardList>;

const Template: ComponentStory<typeof IncentivizedPoolCardList> = args => (
  <div css={wrapper}>
    <IncentivizedPoolCardList {...args} list={poolDummy} currentIndex={1} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  isFetched: true,
  routeItem: action("routeItem"),
  mobile: false,
};

const wrapper = css`
  padding: 1rem 0;
`;
