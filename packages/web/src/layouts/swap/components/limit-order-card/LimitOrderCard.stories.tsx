import BigNumber from "bignumber.js";
import { css, Global, ThemeProvider } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import React from "react";

import { STORY_GNOT_TOKEN, STORY_GNS_TOKEN } from "@components/order/common/order-story-fixtures";
import {
  applyLimitPricePreset,
  calculateTakingAmount,
  stepLimitPrice,
  toLimitSlippageBps,
} from "@hooks/order/data/use-order-handler.utils";
import { calculateLimitMinimumReceived, estimateLimitExecutionFee } from "@utils/order-amount-utils";
import { formatPrice } from "@utils/new-number-utils";
import { formatOrderFeeUsd } from "@utils/order-format-utils";
import globalStyle from "@styles/globalStyle";
import { getTheme } from "@utils/theme-utils";

import LimitOrderCard from "./LimitOrderCard";

const meta = {
  title: "swap/LimitOrderCard",
  component: LimitOrderCard,
  tags: ["autodocs"],
} satisfies Meta<typeof LimitOrderCard>;

export default meta;
type Story = StoryObj<typeof LimitOrderCard>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof LimitOrderCard>) => (
    <div css={wrapper}>
      <div css={cardWrap}>
        <LimitOrderCard {...args} />
      </div>
    </div>
  ),
  args: {
    orderSide: "sell",
    changeOrderSide: fn(),
    swapType: "limit",
    changeSwapType: fn(),
    copied: false,
    copyURL: fn(),
    slippage: 0.5,
    maxSlippage: 10,
    changeSlippage: fn(),
    themeKey: "dark",
    isLoading: false,
    connectedWallet: true,
    tokenA: STORY_GNS_TOKEN,
    tokenB: STORY_GNOT_TOKEN,
    tokenABalance: "1541.5",
    tokenBBalance: "1541.5",
    sellAmount: "1541.55",
    sellAmountUsd: "$1,541.55",
    buyAmount: "1960.235",
    buyAmountUsd: "$1,541.55",
    minimumReceived: "1950.433825",
    executionFee: "0.15%",
    executionFeeAmount: "2.944769",
    executionFeeUsd: "$2.32",
    changeTokenA: fn(),
    changeTokenB: fn(),
    changeSellAmount: fn(),
    changeBuyAmount: fn(),
    switchTokens: fn(),
    limitPrice: "1.2716",
    marketPrice: "1.2716",
    selectedPreset: 0,
    changeLimitPrice: fn(),
    stepPrice: fn(),
    applyPreset: fn(),
    expiry: 86400,
    expiryOptions: [
      { value: 3600, label: "1 Hour" },
      { value: 86400, label: "1 Day" },
      { value: 604800, label: "1 Week" },
      { value: 2592000, label: "30 Days" },
    ],
    changeExpiry: fn(),
    buttonState: "PLACE_ORDER",
    buttonText: "Place Order",
    minTradingText: "Minimum 0.0001 GNS",
    onClickButton: fn(),
  },
};

export const InteractivePresets: Story = {
  ...Default,
  args: {
    ...Default.args,
    limitPrice: applyLimitPricePreset(Default.args?.marketPrice ?? "1", 10),
    selectedPreset: 10,
  },
  render: function InteractivePresets(args) {
    const [customPrice, setLimitPrice] = React.useState(args.limitPrice);
    const [selectedPreset, setSelectedPreset] = React.useState(args.selectedPreset);
    const limitPrice =
      selectedPreset !== null && args.marketPrice
        ? applyLimitPricePreset(args.marketPrice, selectedPreset)
        : customPrice;
    const outputUsd = BigNumber(args.buyAmountUsd.replace(/[$,]/g, "")).dividedBy(args.buyAmount);
    const outputToken = args.tokenB ?? STORY_GNOT_TOKEN;
    const rawTakingAmount = calculateTakingAmount(
      BigNumber(args.sellAmount || 0)
        .shiftedBy((args.tokenA ?? STORY_GNS_TOKEN).decimals)
        .toFixed(0, BigNumber.ROUND_FLOOR),
      limitPrice,
      args.tokenA ?? STORY_GNS_TOKEN,
      outputToken,
      args.orderSide,
    );
    const buyAmount = BigNumber(rawTakingAmount).shiftedBy(-outputToken.decimals).toFixed();
    const rawFee = estimateLimitExecutionFee(rawTakingAmount, 15);
    const executionFeeAmount = rawFee === null ? null : BigNumber(rawFee).shiftedBy(-outputToken.decimals).toFixed();
    const minimumReceived = BigNumber(rawTakingAmount).isGreaterThan(0)
      ? BigNumber(
          calculateLimitMinimumReceived(rawTakingAmount, toLimitSlippageBps(args.slippage, args.maxSlippage * 100)),
        )
          .shiftedBy(-outputToken.decimals)
          .toFixed()
      : "";

    return (
      <div css={wrapper}>
        <div css={cardWrap}>
          <LimitOrderCard
            {...args}
            limitPrice={limitPrice}
            selectedPreset={selectedPreset}
            buyAmount={buyAmount}
            buyAmountUsd={formatPrice(BigNumber(buyAmount).multipliedBy(outputUsd))}
            minimumReceived={minimumReceived}
            executionFeeAmount={executionFeeAmount}
            executionFeeUsd={formatOrderFeeUsd(executionFeeAmount, outputUsd.toFixed())}
            changeLimitPrice={price => {
              setSelectedPreset(null);
              setLimitPrice(price);
            }}
            stepPrice={direction => {
              setSelectedPreset(null);
              setLimitPrice(stepLimitPrice(limitPrice, direction));
            }}
            applyPreset={percent => {
              if (args.marketPrice) setSelectedPreset(percent);
            }}
          />
        </div>
      </div>
    );
  },
};

export const InteractivePresetsLight: Story = {
  ...InteractivePresets,
  decorators: [
    Story => (
      <ThemeProvider theme={getTheme("light")}>
        <Global styles={globalStyle} />
        <Story />
      </ThemeProvider>
    ),
  ],
  args: { ...InteractivePresets.args, themeKey: "light" },
};

export const SmallMarketPrice: Story = {
  ...Default,
  args: {
    ...Default.args,
    tokenABalance: "1000000",
    sellAmount: "1000000",
    sellAmountUsd: "$1",
    buyAmount: "4.4053",
    buyAmountUsd: "$1",
    minimumReceived: "4.383274",
    limitPrice: "0.0000044053",
    marketPrice: "0.0000044053",
  },
};

export const LargeMarketPrice: Story = {
  ...Default,
  args: { ...Default.args, marketPrice: "74309.7" },
};

export const AmountTooLow: Story = {
  ...Default,
  args: { ...Default.args, sellAmount: "10", buttonState: "AMOUNT_TOO_LOW", buttonText: "Amount Too Low" },
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const cardWrap = () => css`
  width: 500px;
  max-width: 100%;
`;
