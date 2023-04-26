import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectUnstakePeriod from "./SelectUnstakePeriod";

export default {
  title: "stake/SelectUnstakePeriod",
  component: SelectUnstakePeriod,
} as ComponentMeta<typeof SelectUnstakePeriod>;

const init = [
  {
    days: "7 days",
    apr: "88%",
  },
  {
    days: "14 days",
    apr: "130%",
  },
  {
    days: "21 days",
    apr: "202%",
  },
];

const Template: ComponentStory<typeof SelectUnstakePeriod> = args => {
  const [activePeriod, setActivePeriod] = useState(-1);

  const onClickPeriod = (idx: number) => {
    setActivePeriod(idx);
  };
  return (
    <SelectUnstakePeriod
      {...args}
      activePeriod={activePeriod}
      onClickPeriod={onClickPeriod}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  period: init,
};
