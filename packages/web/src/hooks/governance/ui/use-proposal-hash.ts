import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

export const NONE_PROPOSAL_ID = 0;

export function parseProposalHash(hash?: string): number {
  const value = (hash ?? "").replace("#", "");
  if (!/^\d+$/.test(value)) return NONE_PROPOSAL_ID;

  const proposalId = Number(value);
  return Number.isSafeInteger(proposalId) && proposalId > 0 ? proposalId : NONE_PROPOSAL_ID;
}

/**
 * Keeps the opened proposal in sync with the URL hash. (e.g. `/governance#1`)
 */
export function useProposalHash() {
  const router = useRouter();
  const [selectedProposalId, setSelectedProposalId] = useState(NONE_PROPOSAL_ID);

  useEffect(() => {
    setSelectedProposalId(parseProposalHash(window.location.hash));
  }, []);

  useEffect(() => {
    const syncWithHash = (url: string) => {
      setSelectedProposalId(parseProposalHash(url.split("#")[1]));
    };

    // Next.js emits `hashChangeComplete` only for hash-only transitions,
    // so query changes that also move the hash arrive as `routeChangeComplete`.
    router.events.on("hashChangeComplete", syncWithHash);
    router.events.on("routeChangeComplete", syncWithHash);
    return () => {
      router.events.off("hashChangeComplete", syncWithHash);
      router.events.off("routeChangeComplete", syncWithHash);
    };
  }, [router.events]);

  const selectProposal = useCallback(
    (proposalId: number) => {
      setSelectedProposalId(proposalId);

      const [basePath] = router.asPath.split("#");
      const options = { shallow: true, scroll: false };

      if (proposalId === NONE_PROPOSAL_ID) {
        router.replace(basePath, undefined, options);
        return;
      }

      router.push(`${basePath}#${proposalId}`, undefined, options);
    },
    [router],
  );

  return { selectedProposalId, selectProposal };
}

export default useProposalHash;
