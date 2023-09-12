import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyPositionCardList from "./MyPositionCardList";
import { dummyPositionList } from "@containers/my-position-card-list-container/MyPositionCardListContainer";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/MyPositionCardList",
  component: MyPositionCardList,
  argTypes: {
    isFetched: {
      options: [true, false],
      control: { type: "boolean" },
    },
  },
} as ComponentMeta<typeof MyPositionCardList>;

const Template: ComponentStory<typeof MyPositionCardList> = args => (
  <MyPositionCardList {...args} positions={dummyPositionList} />
);

export const Default = Template.bind({});
Default.args = {
  isFetched: true,
  currentIndex: 1,
  mobile: false,
  loadMore: true,
  movePoolDetail: action("movePoolDetail"),
  onClickLoadMore: action("onClickLoadMore"),
};
