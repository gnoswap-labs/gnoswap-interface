import type { UseQueryResult } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { useGetToken } from "@query/token";
import type { ITokenResponse } from "@repositories/token";

import { useGnotToGnot } from "./use-gnot-wugnot";

jest.mock("@constants/environment.constant", () => ({ WRAPPED_GNOT_PATH: "wugnot" }));
jest.mock("@query/token", () => ({ useGetToken: jest.fn() }));

describe("useGnotToGnot", () => {
  it("preserves the transaction path when displaying wUGNOT as GNOT, even before GNOT metadata loads", () => {
    jest.mocked(useGetToken).mockReturnValue({ data: undefined } as UseQueryResult<ITokenResponse, Error>);

    const { result, rerender } = renderHook(() => useGnotToGnot());

    expect(result.current.getGnotPath({ path: "wugnot", displaySymbol: "wugnot" }).wrappedPath).toBe("wugnot");
    expect(
      result.current.getGnotPath({ path: "ugnot", displaySymbol: "GNOT", wrappedPath: "wugnot" }).wrappedPath,
    ).toBe("wugnot");

    jest.mocked(useGetToken).mockImplementation(
      path =>
        ({
          data: path === "ugnot" ? ({ path: "ugnot" } as ITokenResponse) : undefined,
        }) as UseQueryResult<ITokenResponse, Error>,
    );
    rerender();

    expect(result.current.getGnotPath({ path: "wugnot", displaySymbol: "wugnot" })).toMatchObject({
      path: "ugnot",
      wrappedPath: "wugnot",
    });
  });
});
