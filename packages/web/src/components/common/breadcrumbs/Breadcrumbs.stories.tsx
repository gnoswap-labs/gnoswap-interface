import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Breadcrumbs from "./Breadcrumbs";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/Breadcrumbs",
  component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>;

const Template: ComponentStory<typeof Breadcrumbs> = args => (
  <Breadcrumbs {...args} />
);

export const Default = Template.bind({});
Default.args = {
  steps: [
    {
      title: "Earn",
      path: "/earn",
    },
    {
      title: "GNOS/GNOT (0.3%)",
    },
  ],
  onClickPath: action("onClickPath"),
};
