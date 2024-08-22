import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SubMenuButton from "./SubMenuButton";

export default {
  title: "common/SubMenuButton",
  component: SubMenuButton,
  decorators: [
    Story => (
      <div
        style={{
          position: "fixed",
          top: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof SubMenuButton>;

const Template: ComponentStory<typeof SubMenuButton> = args => (
  <SubMenuButton {...args} />
);

export const Disconnected = Template.bind({});
Disconnected.args = {
  sideMenuToggle: true,
};

export const Connected = Template.bind({});
Connected.args = {
  sideMenuToggle: false,
};
