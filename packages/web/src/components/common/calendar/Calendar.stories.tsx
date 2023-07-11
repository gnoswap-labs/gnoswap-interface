import { ComponentStory, ComponentMeta } from "@storybook/react";
import Calendar from "./Calendar";
import { action } from '@storybook/addon-actions';

export default {
  title: "common/Calendar",
  component: Calendar,
} as ComponentMeta<typeof Calendar>;

const Template: ComponentStory<typeof Calendar> = args => (
  <Calendar {...args} />
);

export const Default = Template.bind({});
Default.args = {
  selectedDate: {
    year: 2022,
    month: 12,
    date: 24,
  },
  dayOfWeeks: ["S", "M", "T", "W", "T", "F", "S"],
  onClickDate: action("onClickDate"),
};
