import {
  LIQUIDITY_GRAPH_BIN_COUNT,
  LIQUIDITY_GRAPH_DEFAULT_VISIBLE_TICK_RANGE,
  LIQUIDITY_GRAPH_INITIAL_ZOOM_LEVEL,
  LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES,
} from "./graph.constant";

describe("liquidity graph constants", () => {
  it("uses the initial zoom level for compact graph defaults", () => {
    expect(LIQUIDITY_GRAPH_DEFAULT_VISIBLE_TICK_RANGE).toBe(
      LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[LIQUIDITY_GRAPH_INITIAL_ZOOM_LEVEL],
    );
  });

  it("keeps liquidity graphs fixed at forty bins", () => {
    expect(LIQUIDITY_GRAPH_BIN_COUNT).toBe(40);
  });
});
