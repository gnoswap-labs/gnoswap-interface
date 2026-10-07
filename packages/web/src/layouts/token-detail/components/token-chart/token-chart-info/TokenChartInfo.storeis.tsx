import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import TokenChartInfo, { type TokenChartInfoProps } from "./TokenChartInfo";
import { Meta, StoryObj } from "@storybook/nextjs";

export default {
  title: "token/TokenChartInfo",
  component: TokenChartInfo,
} as Meta<typeof TokenChartInfo>;

export const Default: StoryObj<TokenChartInfoProps> = {
  args: {
    token: {
      name: "GnoSwap",
      symbol: "GNS",
      displaySymbol: "GNS",
      image: "https://miro.medium.com/v2/resize:fill:44:44/1*61CWWk33Fx8vLVvto5nJHQ.png",
    },
    priceInfo: {
      amount: {
        value: 0.9844,
        denom: "UTC",
        status: MATH_NEGATIVE_TYPE.NONE,
      },
      priceGradeType: "NONE",
      changedRate: "7.43%",
    },
  },
};
