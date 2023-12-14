import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import EarnMyPositionsContent from "./EarnMyPositionsContent";

export default {
  title: "earn/EarnMyPositionsContent",
  component: EarnMyPositionsContent,
} as ComponentMeta<typeof EarnMyPositionsContent>;

const Template: ComponentStory<typeof EarnMyPositionsContent> = args => (
  <EarnMyPositionsContent {...args} />
);

export const UnConnected = Template.bind({});
UnConnected.args = {
  connected: false,
  fetched: true,
  positions: [],
  connect: action("connect"),
  movePoolDetail: action("movePoolDetail"),
};

export const NoLiquidity = Template.bind({});
NoLiquidity.args = {
  connected: true,
  fetched: true,
  positions: [],
  connect: action("connect"),
  movePoolDetail: action("movePoolDetail"),
};

export const CardList = Template.bind({});
CardList.args = {
  connected: true,
  fetched: true,
  positions: [],
  connect: action("connect"),
  movePoolDetail: action("movePoolDetail"),
};
