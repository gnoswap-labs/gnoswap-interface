import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnMyPositions from "./EarnMyPositions";
import { action } from "@storybook/addon-actions";

export default {
  title: "earn/EarnMyPositions",
  component: EarnMyPositions,
} as ComponentMeta<typeof EarnMyPositions>;

const Template: ComponentStory<typeof EarnMyPositions> = args => (
  <EarnMyPositions {...args} />
);

export const UnConnected = Template.bind({});
UnConnected.args = {
  connected: false,
  fetched: true,
  positions: [],
  connect: action("connect"),
  moveEarnAdd: action("moveEarnAdd"),
  movePoolDetail: action("movePoolDetail"),
};

export const NoLiquidity = Template.bind({});
NoLiquidity.args = {
  connected: true,
  fetched: true,
  positions: [],
  connect: action("connect"),
  moveEarnAdd: action("moveEarnAdd"),
  movePoolDetail: action("movePoolDetail"),
};

export const CardList = Template.bind({});
CardList.args = {
  connected: true,
  fetched: true,
  positions: [],
  connect: action("connect"),
  moveEarnAdd: action("moveEarnAdd"),
  movePoolDetail: action("movePoolDetail"),
};
