import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import GainerAndLoser from "./GainerAndLoser";
import {
  gainersInit,
  losersInit,
} from "@containers/gainer-and-loser-container/GainerAndLoserContainer";

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
