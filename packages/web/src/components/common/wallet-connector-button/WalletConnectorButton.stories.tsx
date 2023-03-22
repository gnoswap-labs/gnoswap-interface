import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import WalletConnectorButton from "./WalletConnectorButton";

export default {
  title: "common/WalletConnector",
  component: WalletConnectorButton,
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
} as ComponentMeta<typeof WalletConnectorButton>;

const Template: ComponentStory<typeof WalletConnectorButton> = args => (
  <WalletConnectorButton {...args} />
);

export const Disconnected = Template.bind({});
Disconnected.args = {
  isConnected: false,
};

export const Connected = Template.bind({});
Connected.args = {
  isConnected: true,
};
