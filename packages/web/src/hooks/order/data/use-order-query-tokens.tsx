import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

import { GNOT_TOKEN_DEFAULT } from "@common/values/token-constant";
import useRouter from "@hooks/common/use-custom-router";
import { useGetTokens } from "@query/token";
import { SwapState } from "@states/index";

export function getQueryString(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

/**
 * Applies the `from` / `to` tokens of a shared order link once the token list
 * is loaded, then hands over to the form. Without them the pair the user had
 * on another tab is kept, and an empty sell side starts as GNOT.
 *
 * @param onApplied Receives the full query once, for the form specific fields.
 */
export const useOrderQueryTokens = (onApplied?: (query: Record<string, string | string[] | undefined>) => void) => {
  const router = useRouter();
  const [, setSwapValue] = useAtom(SwapState.swap);
  const { data: { tokens = [] } = {} } = useGetTokens(true);
  const applied = useRef(false);
  const onAppliedRef = useRef(onApplied);
  onAppliedRef.current = onApplied;

  useEffect(() => {
    if (applied.current || tokens.length === 0) return;
    applied.current = true;

    const query = router.query;
    const from = getQueryString(query.from);
    const to = getQueryString(query.to);
    const tokenA = from ? tokens.find(token => token.path === from) ?? null : null;
    const tokenB = to ? tokens.find(token => token.path === to) ?? null : null;

    setSwapValue(prev => ({
      ...prev,
      tokenA: tokenA ?? (from ? null : prev.tokenA ?? GNOT_TOKEN_DEFAULT),
      tokenB: tokenB ?? (to ? null : prev.tokenB ?? null),
    }));

    onAppliedRef.current?.(query);
  }, [router.query, setSwapValue, tokens]);
};
