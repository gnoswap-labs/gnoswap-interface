import { readFileSync } from "fs";
import { join } from "path";

const readDetailSource = (fileName: string) =>
  readFileSync(join(__dirname, "pool-pair-information/pool-pair-info-content", fileName), "utf8");

const readPositionSource = (fileName: string) =>
  readFileSync(join(__dirname, "my-liquidity/my-detailed-position-card", fileName), "utf8");

describe("pool detail graph controls", () => {
  it("keeps zoom controls on the pool detail graph without horizontal movement controls", () => {
    const source = readDetailSource("PoolPairInfoContent.tsx");

    expect(source).toContain("IconRemove");
    expect(source).toContain("IconAdd");
    expect(source).toContain("zoom-controller");
    expect(source).not.toContain("IconKeyboardArrowLeft");
    expect(source).not.toContain("IconKeyboardArrowRight");
    expect(source).not.toContain("onMoveLeft");
    expect(source).not.toContain("onMoveRight");
  });

  it("keeps zoom controls on position graphs without horizontal movement controls", () => {
    const source = readPositionSource("MyDetailedPositionCard.tsx");

    expect(source).toContain("IconRemove");
    expect(source).toContain("IconAdd");
    expect(source).toContain("zoom-controller");
    expect(source).not.toContain("IconKeyboardArrowLeft");
    expect(source).not.toContain("IconKeyboardArrowRight");
    expect(source).not.toContain("onMoveLeft");
    expect(source).not.toContain("onMoveRight");
  });
});
