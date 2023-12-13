import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectLiquidityItem from "./SelectLiquidityItem";
import { action } from "@storybook/addon-actions";

export default {
  title: "unstake/SelectLiquidityItem",
  component: SelectLiquidityItem,
} as ComponentMeta<typeof SelectLiquidityItem>;

const Template: ComponentStory<typeof SelectLiquidityItem> = args => {
  const [checked, setChecked] = useState(false);
  return (
    <SelectLiquidityItem
      {...args}
      onCheckedItem={() => setChecked(prev => !prev)}
      checkedList={checked ? ["#11111"] : []}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  checkedList: [],
  onCheckedItem: action("onCheckedItem"),
};
