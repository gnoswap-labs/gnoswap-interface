import { sortTokenPaths } from "./sort-utils";
import { GNS_TOKEN_PATH, WRAPPED_GNOT_PATH } from "@constants/environment.constant";

describe("sortTokenPaths utility function test", () => {
  test("Same result as default sort - plain string", () => {
    const tokens = ["gns", "GNS", "Gns", "FOO", "BAR", "BAZ"];

    expect([...tokens].sort()).toEqual([...tokens].sort(sortTokenPaths));
  });

  test("Same result as default sort - includes undefined", () => {
    const tokens = ["gns", "GNS", undefined, "Gns", "FOO", "BAR", "BAZ"];

    expect([...tokens].sort()).toEqual([...tokens].sort(sortTokenPaths));
  });

  test("Same result as default sort - includes number", () => {
    const tokens = ["GNOT1", "GNOT2", "GNOT10", "GNS1", "GNS10", "GNS2", "wrapped.GNOT1", "wrapped.GNS1", undefined];

    expect([...tokens].sort()).toEqual([...tokens].sort(sortTokenPaths));
  });

  test("Same result as default sort - includes special characters", () => {
    const tokens = ["gns-1", "gns_1", "gns.1", "gns/1", undefined, "GNS"];

    expect([...tokens].sort()).toEqual([...tokens].sort(sortTokenPaths));
  });

  test("Testing real-world use cases", () => {
    const tokens = [WRAPPED_GNOT_PATH, GNS_TOKEN_PATH];

    expect([...tokens].sort()).toEqual([...tokens].sort(sortTokenPaths));
  });
});
