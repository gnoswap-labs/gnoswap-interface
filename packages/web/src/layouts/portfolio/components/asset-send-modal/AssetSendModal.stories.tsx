import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { DEVICE_TYPE } from "@styles/media";

import AssetSendModal from "./AssetSendModal";

const meta = {
  title: "wallet/AssetSendModal",
  component: AssetSendModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AssetSendModal>;

export default meta;
type Story = StoryObj<typeof AssetSendModal>;

export const Default: Story = {
  args: {
    breakpoint: DEVICE_TYPE.WEB,
    withdrawInfo: {
      chainId: "dev",
      createdAt: "2023-10-10T08:48:46+09:00",
      name: "Gnoswap",
      address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
      path: "gno.land/r/gns",
      tokenId: "gno.land/r/gns.GNOT",
      decimals: 4,
      symbol: "GNOT",
      displaySymbol: "GNOT",
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/ugnot.svg",
      type: "GRC20",
      priceID: "gno.land/r/gns",
    },
    avgBlockTime: 2.2,
    connected: true,
    changeToken: fn(),
    close: fn(),
  },
};

export const Mobile: Story = {
  args: {
    ...Default.args,
    breakpoint: DEVICE_TYPE.MOBILE,
  },
};

export const Disconnected: Story = {
  args: {
    ...Default.args,
    connected: false,
  },
};

export const WithHighBlockTime: Story = {
  args: {
    ...Default.args,
    avgBlockTime: 10.5,
  },
};
