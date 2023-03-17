import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import WalletConnector from "./WalletConnector";

export default {
  title: "common/WalletConnector",
  component: WalletConnector,
  decorators: [
    Story => (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof WalletConnector>;

const Template: ComponentStory<typeof WalletConnector> = args => (
  <WalletConnector {...args} />
);

export const Disconnected = Template.bind({});
Disconnected.args = {
  isConnected: true,
};

export const Connected = Template.bind({});
Connected.args = {
  isConnected: false,
};
