import React, { useCallback, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectLiquidityList from "./SelectLiquidityList";

export default {
  title: "stake/SelectLiquidityList",
  component: SelectLiquidityList,
} as ComponentMeta<typeof SelectLiquidityList>;

const Template: ComponentStory<typeof SelectLiquidityList> = args => {

  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [checkedAll] = useState(false);

  const onCheckedItem = useCallback(
    (isChecked: boolean, id: number) => {
      if (isChecked) {
        return setCheckedList((prev: number[]) => [...prev, id]);
      }
      if (!isChecked && checkedList.includes(id)) {
        return setCheckedList(checkedList.filter(el => el !== id));
      }
    },
    [checkedList],
  );

  return (
    <SelectLiquidityList
      {...args}
      checkedList={checkedList}
      onCheckedItem={onCheckedItem}
      checkedAll={checkedAll}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
};
