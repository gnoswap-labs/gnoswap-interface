import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import BestPoolCardList from "./BestPoolCardList";
import { bestPoolListInit } from "@containers/best-pools-container/BestPoolsContainer";

export default {
  title: "token/BestPoolCardList",
  component: BestPoolCardList,
} as ComponentMeta<typeof BestPoolCardList>;

const Template: ComponentStory<typeof BestPoolCardList> = args => (
  <BestPoolCardList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  list: bestPoolListInit,
};
