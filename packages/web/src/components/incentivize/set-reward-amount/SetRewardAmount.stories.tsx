import React, { useCallback, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SetRewardAmount from "./SetRewardAmount";

export default {
  title: "incentivize/SetRewardAmount",
  component: SetRewardAmount,
} as ComponentMeta<typeof SetRewardAmount>;

const Template: ComponentStory<typeof SetRewardAmount> = args => {
  const [amount, setAmount] = useState("");

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAmount(value);
    },
    [],
  );
  return (
    <SetRewardAmount
      {...args}
      amount={amount}
      onChangeAmount={onChangeAmount}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
