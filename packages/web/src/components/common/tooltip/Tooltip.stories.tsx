import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Tooltip from "./Tooltip";

export default {
  title: "common/Tooltip",
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = ({ placement }) => (
  <div
    style={{
      width: 200,
      height: 300,
      backgroundColor: "yellow",
      overflowX: "hidden",
      overflowY: "auto",
    }}
  >
    <div
      style={{
        marginTop: 200,
        height: 500,
      }}
    >
      <Tooltip placement={placement} FloatingContent={<div>Hello Gnoswap</div>}>
        <div
          style={{
            width: 200,
            height: 100,
            backgroundColor: "green",
            textAlign: "center",
          }}
        />
      </Tooltip>
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  placement: "top",
};
