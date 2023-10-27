import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import WalletConnectorButton from "./WalletConnectorButton";
import { action } from "@storybook/addon-actions";
import { AccountModel } from "@models/account/account-model";

const defaultAccountInfo: AccountModel = {
  status: "ACTIVE",
  address: "g1ffzxha57dh0qgv9ma5v393ur0zexfvp6lsjpae",
  balances: [],
  publicKeyType: "",
  publicKeyValue: "",
  accountNumber: 1,
  sequence: 1,
  chainId: "test3",
};


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
  connected: false,
  account: null,
  connectAdenaClient: action("connectAdenaClient"),
  disconnectWallet: action("disconnectWallet"),
};

export const Connected = Template.bind({});
Connected.args = {
  connected: true,
  account: defaultAccountInfo,
  connectAdenaClient: action("connectAdenaClient"),
  disconnectWallet: action("disconnectWallet"),
};
