import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EarnMyPositionNoLiquidity from "./EarnMyPositionNoLiquidity";

export default {
  title: "earn/EarnMyPositionNoLiquidity",
  component: EarnMyPositionNoLiquidity,
} as ComponentMeta<typeof EarnMyPositionNoLiquidity>;

const Template: ComponentStory<typeof EarnMyPositionNoLiquidity> = args => (
  <EarnMyPositionNoLiquidity {...args} />
);

export const Default = Template.bind({});
Default.args = {
  account: null,
};
