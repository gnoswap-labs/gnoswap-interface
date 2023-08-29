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
  <MyPositionCardList {...args} list={dummyPositionList} />
);

export const Default = Template.bind({});
Default.args = {
  isFetched: true,
  routeItem: action("routeItem"),
  mobile: false,
  loadMore: true,
  onClickLoadMore: action("onClickLoadMore"),
};
