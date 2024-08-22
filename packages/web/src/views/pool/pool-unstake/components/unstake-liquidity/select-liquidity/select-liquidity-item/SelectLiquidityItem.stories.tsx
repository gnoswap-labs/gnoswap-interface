import { useState } from "react";
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import SelectLiquidityItem from "./SelectLiquidityItem";

export default {
  title: "pool/pool-unstake/SelectLiquidityItem",
  component: SelectLiquidityItem,
} as ComponentMeta<typeof SelectLiquidityItem>;

const Template: ComponentStory<typeof SelectLiquidityItem> = args => {
  const [checked, setChecked] = useState(false);
  return (
    <SelectLiquidityItem
      {...args}
      onCheckedItem={() => setChecked(prev => !prev)}
      checkedList={checked ? [1111] : []}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  checkedList: [],
  onCheckedItem: action("onCheckedItem"),
};
