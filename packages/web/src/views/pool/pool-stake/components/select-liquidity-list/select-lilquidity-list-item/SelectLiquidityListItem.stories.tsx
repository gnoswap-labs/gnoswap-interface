import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectLiquidityListItem from "./SelectLiquidityListItem";
import { action } from "@storybook/addon-actions";

export default {
  title: "stake/SelectLiquidityListItem",
  component: SelectLiquidityListItem,
} as ComponentMeta<typeof SelectLiquidityListItem>;

const Template: ComponentStory<typeof SelectLiquidityListItem> = args => {
  const [checked, setChecked] = useState(false);
  return (
    <SelectLiquidityListItem
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
