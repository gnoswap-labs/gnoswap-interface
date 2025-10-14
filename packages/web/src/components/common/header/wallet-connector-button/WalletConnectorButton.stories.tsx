import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import WalletConnectorButton from "./WalletConnectorButton";
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
  email: "",
};

const meta = {
  title: "common/WalletConnector",
  component: WalletConnectorButton,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
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
} satisfies Meta<typeof WalletConnectorButton>;

export default meta;
type Story = StoryObj<typeof WalletConnectorButton>;

export const Disconnected: Story = {
  args: {
    connected: false,
    account: null,
    connectAdenaClient: fn(),
    disconnectWallet: fn(),
  },
};

export const Connected: Story = {
  args: {
    connected: true,
    account: defaultAccountInfo,
    connectAdenaClient: fn(),
    disconnectWallet: fn(),
  },
};
