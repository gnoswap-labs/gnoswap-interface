import React, { useCallback, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectLiquidityList from "./SelectLiquidityList";

export default {
  title: "stake/SelectLiquidityList",
  component: SelectLiquidityList,
} as ComponentMeta<typeof SelectLiquidityList>;

const Template: ComponentStory<typeof SelectLiquidityList> = args => {

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [checkedAll] = useState(false);

  const onCheckedItem = useCallback(
    (isChecked: boolean, path: string) => {
      if (isChecked) {
        return setCheckedList((prev: string[]) => [...prev, path]);
      }
      if (!isChecked && checkedList.includes(path)) {
        return setCheckedList(checkedList.filter(el => el !== path));
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
