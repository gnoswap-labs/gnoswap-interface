import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { css, Theme } from "@emotion/react";

import { DEVICE_TYPE } from "@styles/media";

import AssetInfo from "./AssetInfo";

const meta = {
  title: "wallet/AssetList/AssetInfo",
  component: AssetInfo,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AssetInfo>;

export default meta;
type Story = StoryObj<typeof AssetInfo>;

export const Default: Story = {
  args: {
    asset: {
      type: "GRC20",
      chainId: "dev",
      createdAt: "2023-12-12 23:45:12",
      name: "Bar",
      path: "gno.land/r/bar",
      tokenId: "gno.land/r/bar.BAR",
      decimals: 6,
      symbol: "BAR",
      displaySymbol: "BAR",
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
      priceID: "gno.land/r/bar",
      description: "this_is_desc_section",
      websiteURL: "https://website~~~~",
      balance: 0.0,
      price: "0",
    },
    deposit: fn(),
    withdraw: fn(),
    breakpoint: DEVICE_TYPE.WEB,
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
