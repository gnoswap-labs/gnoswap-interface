import React, { useCallback, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectLiquidity from "./SelectLiquidity";

export default {
  title: "stake/SelectLiquidity",
  component: SelectLiquidity,
} as ComponentMeta<typeof SelectLiquidity>;

const Template: ComponentStory<typeof SelectLiquidity> = args => {
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
    <SelectLiquidity
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
