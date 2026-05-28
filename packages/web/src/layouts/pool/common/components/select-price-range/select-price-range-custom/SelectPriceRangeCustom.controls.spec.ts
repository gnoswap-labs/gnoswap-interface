import { readFileSync } from "fs";
import { join } from "path";

const readSource = (fileName: string) => readFileSync(join(__dirname, fileName), "utf8");
const readSelectionGraphSource = () =>
  readFileSync(
    join(__dirname, "../../../../../../components/common/pool-selection-graph/PoolSelectionGraph.tsx"),
    "utf8",
  );

describe("select price range custom graph controls", () => {
  it("removes horizontal movement controls from add liquidity custom range", () => {
    const source = readSource("SelectPriceRangeCustom.tsx");

    expect(source).not.toContain("IconKeyboardArrowLeft");
    expect(source).not.toContain("IconKeyboardArrowRight");
    expect(source).not.toContain("shiftPosition");
    expect(source).not.toContain("shiftIndex");
    expect(source).not.toContain("moveLeft");
    expect(source).not.toContain("moveRight");
  });

  it("removes horizontal movement controls from reposition custom range", () => {
    const source = readSource("SelectPriceRangeCustomReposition.tsx");

    expect(source).not.toContain("IconKeyboardArrowLeft");
    expect(source).not.toContain("IconKeyboardArrowRight");
    expect(source).not.toContain("shiftPosition");
    expect(source).not.toContain("shiftIndex");
    expect(source).not.toContain("moveLeft");
    expect(source).not.toContain("moveRight");
  });

  it("preserves zoom, min/max, reset, full-range, and brush controls", () => {
    const addSource = readSource("SelectPriceRangeCustom.tsx");
    const repositionSource = readSource("SelectPriceRangeCustomReposition.tsx");
    const graphSource = readSelectionGraphSource();

    for (const source of [addSource, repositionSource]) {
      expect(source).toContain("IconRemove");
      expect(source).toContain("IconAdd");
      expect(source).toContain("IconRefresh");
      expect(source).toContain("IconSwap");
      expect(source).toContain("increaseMinTick");
      expect(source).toContain("decreaseMinTick");
      expect(source).toContain("increaseMaxTick");
      expect(source).toContain("decreaseMaxTick");
      expect(source).toContain("PoolSelectionGraph");
    }

    expect(graphSource).toContain(".brushX()");
    expect(graphSource).toContain(".on(\"start brush\", onBrushMove)");
    expect(graphSource).toContain(".on(\"end\", onBrushEnd)");
  });
});
