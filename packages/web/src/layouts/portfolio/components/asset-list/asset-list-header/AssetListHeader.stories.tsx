import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { DEVICE_TYPE } from "@styles/media";

import AssetListHeader, { ASSET_FILTER_TYPE } from "./AssetListHeader";

const meta = {
  title: "wallet/AssetList/AssetListHeader",
  component: AssetListHeader,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof AssetListHeader>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof AssetListHeader>]?: React.ComponentProps<typeof AssetListHeader>[K];
}>;

export const Default: Story = {
  args: {
    assetType: ASSET_FILTER_TYPE.ALL,
    invisibleZeroBalance: true,
    changeAssetType: fn(),
    toggleInvisibleZeroBalance: fn(),
    search: fn(),
    breakpoint: DEVICE_TYPE.WEB,
    searchIcon: true,
    onTogleSearch: fn(),
  },
};
