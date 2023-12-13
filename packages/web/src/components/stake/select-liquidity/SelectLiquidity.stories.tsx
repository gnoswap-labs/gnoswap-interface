import React, { useCallback, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectLiquidity from "./SelectLiquidity";

export default {
  title: "stake/SelectLiquidity",
  component: SelectLiquidity,
} as ComponentMeta<typeof SelectLiquidity>;

const Template: ComponentStory<typeof SelectLiquidity> = args => {
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
