import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { gainersInit } from "./gainer-card-list/GainerCardList.stories";
import GainerAndLoser from "./GainerAndLoser";
import { losersInit } from "./loser-card-list/LoserCardList.stories";

export default {
  title: "token/GainerAndLoser",
  component: GainerAndLoser,
} as ComponentMeta<typeof GainerAndLoser>;

const Template: ComponentStory<typeof GainerAndLoser> = args => (
  <GainerAndLoser {...args} />
);

export const Default = Template.bind({});
Default.args = {
  gainers: gainersInit,
  losers: losersInit,
};
