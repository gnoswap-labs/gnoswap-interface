import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ActivityList from "./ActivityList";
import { css, Theme } from "@emotion/react";
import { action } from "@storybook/addon-actions";
import { DEVICE_TYPE } from "@styles/media";

const dummyTokenList = [
  {
    action: "Add GNOT and GNS",
    totalValue: "$12,090",
    tokenAmountOne: "100 ATOM",
    tokenAmountTwo: "19 GNS",
    account: "g129kua...ndsu12",
    time: "less than a minute ago",
    explorerUrl:
      "https://gnoscan.io/transactions/details?txhash=hNaBGE2oDb15Q08y68wpycjwwGaCcXcU2jnrRRfuUo0%3D",
  },
];

export default {
  title: "dashboard/ActivityList",
  component: ActivityList,
} as ComponentMeta<typeof ActivityList>;

const Template: ComponentStory<typeof ActivityList> = args => (
  <div css={wrapper}>
    <ActivityList {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  activities: dummyTokenList,
  isFetched: true,
  error: null,
  activityType: "All",
  changeActivityType: action("changeActivityType"),
  currentPage: 0,
  totalPage: 10,
  movePage: action("movePage"),
  isSortOption: () => true,
  sort: action("sort"),
  breakpoint: DEVICE_TYPE.WEB,
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
