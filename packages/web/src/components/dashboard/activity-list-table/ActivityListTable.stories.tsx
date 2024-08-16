import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import ActivityListTable from "./ActivityListTable";
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
  title: "dashboard/ActivityListTable",
  component: ActivityListTable,
} as ComponentMeta<typeof ActivityListTable>;

const Template: ComponentStory<typeof ActivityListTable> = args => (
  <ActivityListTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  activities: dummyTokenList,
  isFetched: true,
  isSortOption: () => true,
  sort: action("sort"),
  breakpoint: DEVICE_TYPE.WEB,
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  activities: [],
  isFetched: false,
  isSortOption: () => true,
  sort: action("sort"),
  breakpoint: DEVICE_TYPE.WEB,
};

export const NotFount = Template.bind({});
NotFount.args = {
  activities: [],
  isFetched: true,
  isSortOption: () => true,
  sort: action("sort"),
  breakpoint: DEVICE_TYPE.WEB,
};
