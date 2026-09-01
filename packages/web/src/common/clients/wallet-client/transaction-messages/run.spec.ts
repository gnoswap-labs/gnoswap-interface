import { PACKAGE_GRC20_REGISTRY_PATH } from "@constants/environment.constant";

import { gnoInt64Literal, gnoStringLiteral, makeGRC20ApproveRunMessage, makeGRC20TransferRunMessage } from "./run";

describe("gnoStringLiteral", () => {
  it("wraps plain values in a gno string literal", () => {
    expect(gnoStringLiteral("gno.land/r/gnoswap/v1/gns")).toBe("\"gno.land/r/gnoswap/v1/gns\"");
  });

  it("escapes characters that could terminate or extend the literal", () => {
    expect(gnoStringLiteral("a\"b\\c")).toBe("\"a\\\"b\\\\c\"");
    expect(gnoStringLiteral("line\nbreak\ttab\rreturn")).toBe("\"line\\nbreak\\ttab\\rreturn\"");
    expect(gnoStringLiteral(`null${String.fromCharCode(0)}`)).toBe("\"null\\u0000\"");
  });
});

describe("gnoInt64Literal", () => {
  it("renders integer amounts without quotes", () => {
    expect(gnoInt64Literal("9223372036854775807")).toBe("9223372036854775807");
    expect(gnoInt64Literal(0)).toBe("0");
    expect(gnoInt64Literal(10n)).toBe("10");
  });

  it("rejects amounts that are not non-negative integers", () => {
    expect(() => gnoInt64Literal("1.5")).toThrow();
    expect(() => gnoInt64Literal("-1")).toThrow();
    expect(() => gnoInt64Literal("100); evil(")).toThrow();
  });
});

describe("makeGRC20ApproveRunMessage", () => {
  it("runs grc20reg.Approve in an ephemeral main package", () => {
    const message = makeGRC20ApproveRunMessage({
      approves: [{ tokenPath: "gno.land/r/gnoswap/v1/gns", spenderAddress: "g1router", amount: "1250000" }],
      caller: "g1caller",
    });

    expect(message).toEqual({
      caller: "g1caller",
      send: "",
      package: {
        name: "main",
        path: "",
        files: [
          {
            name: "main.gno",
            body:
              "package main\n" +
              "\n" +
              "import (\n" +
              `\tgrc20reg "${PACKAGE_GRC20_REGISTRY_PATH}"\n` +
              ")\n" +
              "\n" +
              "func main(cur realm) {\n" +
              "\tgrc20reg.Approve(0, cur, \"gno.land/r/gnoswap/v1/gns\", address(\"g1router\"), 1250000)\n" +
              "}\n",
          },
        ],
      },
    });
  });

  it("batches consecutive approves into a single run message", () => {
    const message = makeGRC20ApproveRunMessage({
      approves: [
        { tokenPath: "tokenA", spenderAddress: "g1pool", amount: "1250000" },
        { tokenPath: "tokenB", spenderAddress: "g1pool", amount: "3000000" },
      ],
      caller: "g1caller",
    });

    expect(message.package.files).toHaveLength(1);
    expect(message.package.files[0].body).toBe(
      "package main\n" +
        "\n" +
        "import (\n" +
        `\tgrc20reg "${PACKAGE_GRC20_REGISTRY_PATH}"\n` +
        ")\n" +
        "\n" +
        "func main(cur realm) {\n" +
        "\tgrc20reg.Approve(0, cur, \"tokenA\", address(\"g1pool\"), 1250000)\n" +
        "\tgrc20reg.Approve(0, cur, \"tokenB\", address(\"g1pool\"), 3000000)\n" +
        "}\n",
    );
  });

  it("rejects an empty approve list", () => {
    expect(() => makeGRC20ApproveRunMessage({ approves: [], caller: "g1caller" })).toThrow();
  });
});

describe("makeGRC20TransferRunMessage", () => {
  it("runs grc20reg.Transfer in an ephemeral main package", () => {
    const message = makeGRC20TransferRunMessage({
      tokenPath: "gno.land/r/gnoswap/v1/gns",
      toAddress: "g1receiver",
      amount: "1000",
      caller: "g1caller",
    });

    expect(message.package.files[0].body).toContain(
      "\tgrc20reg.Transfer(0, cur, \"gno.land/r/gnoswap/v1/gns\", address(\"g1receiver\"), 1000)\n",
    );
  });
});
