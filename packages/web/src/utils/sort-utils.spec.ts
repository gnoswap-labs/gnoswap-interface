import { sortTokenPaths } from "./sort-utils";

describe("sortTokenPaths utility function test", () => {
  test("Same result as default .sort() - plain string", () => {
    const tokens = ["gns", "GNS", "Gns", "FOO", "BAR", "BAZ"];
    // Result of tokens.sort() as of 2024-12-17
    const expectedSort = ["BAR", "BAZ", "FOO", "GNS", "Gns", "gns"];

    expect([...tokens].sort(sortTokenPaths)).toEqual(expectedSort);
  });

  test("Same result as default .sort() - includes undefined", () => {
    const tokens = ["gns", "GNS", undefined, "Gns", "FOO", "BAR", "BAZ"];
    // Result of tokens.sort() as of 2024-12-17
    const expectedSort = ["BAR", "BAZ", "FOO", "GNS", "Gns", "gns", undefined];

    expect([...tokens].sort(sortTokenPaths)).toEqual(expectedSort);
  });

  test("Same result as default .sort() - includes number", () => {
    const tokens = ["GNOT1", "GNOT2", "GNOT10", "GNS1", "GNS10", "GNS2", "wrapped.GNOT1", "wrapped.GNS1", undefined];
    // Result of tokens.sort() as of 2024-12-17
    const expectedSort = [
      "GNOT1",
      "GNOT10",
      "GNOT2",
      "GNS1",
      "GNS10",
      "GNS2",
      "wrapped.GNOT1",
      "wrapped.GNS1",
      undefined,
    ];

    expect([...tokens].sort(sortTokenPaths)).toEqual(expectedSort);
  });

  test("Same result as default .sort() - includes special characters", () => {
    const tokens = ["gns-1", "gns_1", "gns.1", "gns/1", undefined, "GNS"];
    // Result of tokens.sort() as of 2024-12-17
    const expectedSort = ["GNS", "gns-1", "gns.1", "gns/1", "gns_1", undefined];

    expect([...tokens].sort(sortTokenPaths)).toEqual(expectedSort);
  });

  test("Testing real-world use cases", () => {
    const tokens = ["gno.land/r/gnoswap/v1/gns", "gno.land/r/demo/wugnot"];
    // Result of tokens.sort() as of 2024-12-17
    const expectedSort = ["gno.land/r/demo/wugnot", "gno.land/r/gnoswap/v1/gns"];

    expect([...tokens].sort(sortTokenPaths)).toEqual(expectedSort);
  });
});
