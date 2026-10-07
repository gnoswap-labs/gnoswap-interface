import { useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "../query-keys";
import { useGetTokens } from "./use-get-tokens";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: jest.fn(),
}));

describe("useGetTokens", () => {
  const getTokens = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGnoswapContext as jest.Mock).mockReturnValue({ tokenRepository: { getTokens } });
    (useQuery as jest.Mock).mockReturnValue({});
  });

  it("uses distinct query keys and repository arguments for verification states", async () => {
    useGetTokens(false);
    const falseOptions = (useQuery as jest.Mock).mock.calls[0][0];

    useGetTokens(true);
    const trueOptions = (useQuery as jest.Mock).mock.calls[1][0];

    expect(falseOptions.queryKey).toEqual([QUERY_KEY.tokens, false]);
    expect(trueOptions.queryKey).toEqual([QUERY_KEY.tokens, true]);
    expect(falseOptions.queryKey).not.toEqual(trueOptions.queryKey);

    await falseOptions.queryFn();
    await trueOptions.queryFn();
    expect(getTokens).toHaveBeenNthCalledWith(1, false);
    expect(getTokens).toHaveBeenNthCalledWith(2, true);
  });

  it("preserves query options as the second argument", () => {
    const options = { enabled: false };

    useGetTokens(true, options);

    expect((useQuery as jest.Mock).mock.calls[0][0]).toMatchObject(options);
  });
});
