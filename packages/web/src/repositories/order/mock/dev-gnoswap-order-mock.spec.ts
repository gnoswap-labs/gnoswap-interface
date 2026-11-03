import BigNumber from "bignumber.js";

import { devDcaFixtures, devDcaSchedule, devLimitFixtures, nextSlot } from "./dev-gnoswap-order-mock";

describe("dev.gnoswap order fixtures", () => {
  it("keeps DCA order totals consistent with their executions", () => {
    devDcaFixtures("g1owner").forEach(({ order, executions }) => {
      const purchased = executions.reduce((sum, item) => sum.plus(item.purchasedAmount), BigNumber(0));

      expect(executions).toHaveLength(order.executedCount);
      expect(purchased.toFixed()).toBe(order.purchasedAmount);
      expect(BigNumber(order.soldAmount).plus(order.remainingAmount).plus(order.refundedAmount).toFixed()).toBe(
        order.depositAmount,
      );
      expect(order.nextExecutionAt === null).toBe(order.remainingCount === 0);
    });
  });

  it("keeps Limit fills consistent with their orders", () => {
    devLimitFixtures("g1owner").forEach(({ order, fills }) => {
      const filled = fills.reduce((sum, fill) => sum.plus(fill.amountIn), BigNumber(0));

      expect(filled.toFixed()).toBe(order.filledInput);
      expect(
        BigNumber(order.filledInput).plus(order.remainingInput).plus(order.refundedInput).toFixed(),
      ).toBe(order.makingAmount);
    });
  });

  it("schedules the next slot of the interval", () => {
    expect(nextSlot(3_601, 3_600)).toBe(7_200);
    expect(nextSlot(7_200, 3_600)).toBe(7_200);

    const schedule = devDcaSchedule(3_600, 3);
    expect(schedule.estimatedEndAt - schedule.firstExecutionAt).toBe(7_200);
  });
});
