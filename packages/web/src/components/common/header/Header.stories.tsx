import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { css, Theme } from "@emotion/react";
import { fn } from "@storybook/test";

import Header from "./Header";
import { DEVICE_TYPE } from "@styles/media";
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
  title: "common/Header",
  component: Header,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof Header>]?: React.ComponentProps<typeof Header>[K];
}>;

export const Default: Story = {
  args: {
    pathname: "/",
    connected: false,
    account: defaultAccountInfo,
    connectAdenaClient: fn(),
    disconnectWallet: fn(),
    sideMenuToggle: true,
    onSideMenuToggle: fn(),
    searchMenuToggle: true,
    onSearchMenuToggle: fn(),
    tokens: [],
    isFetched: true,
    error: null,
    search: fn(),
    keyword: "",
    breakpoint: DEVICE_TYPE.WEB,
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
