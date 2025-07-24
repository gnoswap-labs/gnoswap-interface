import { useCallback, useEffect } from "react";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";

const GNOSWAP_PROPOSAL_DRAFT_KEY = "gnoswap_proposal-drafts";

interface ProposalDraft {
  title: string;
  description: string;
  lastModified: number;
}

interface ProposalDraftData {
  title: string;
  description: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface UseProposalDraftProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  isDirty: boolean;
}

/**
 *
 * @param setValue - react-hook-form (setValue function)
 * @param watch - react-hook-form (watch function)
 * @param isDirty - react-hook-form (Whether the form has changed)
 * @returns Draft management functions and their current values
 */
export function useProposalDraft({ setValue, watch, isDirty }: UseProposalDraftProps) {
  /**
   * Save proposal drafts to local storage
   */
  const saveProposalDraft = useCallback((title: string, description: string) => {
    if (!title && !description) return;

    const draft: ProposalDraft = {
      title,
      description,
      lastModified: Date.now(),
    };

    localStorage.setItem(GNOSWAP_PROPOSAL_DRAFT_KEY, JSON.stringify(draft));
  }, []);

  /**
   * Load proposal drafts from local storage
   */
  const loadProposalDraft = useCallback((): ProposalDraftData | null => {
    try {
      const draftJSON = localStorage.getItem(GNOSWAP_PROPOSAL_DRAFT_KEY);
      if (!draftJSON) return null;

      const draft = JSON.parse(draftJSON) as ProposalDraft;

      return {
        title: draft.title || "",
        description: draft.description || "",
      };
    } catch (error) {
      console.error("Failed to load proposal draft:", error);
      return null;
    }
  }, []);

  /**
   * Deleting proposal drafts from local storage
   */
  const clearProposalDraft = useCallback(() => {
    localStorage.removeItem(GNOSWAP_PROPOSAL_DRAFT_KEY);
  }, []);

  // Load saved drafts when mounting components
  useEffect(() => {
    const draft = loadProposalDraft();
    if (draft) {
      setValue("title", draft.title);
      setValue("description", draft.description);
    }
  }, [loadProposalDraft, setValue]);

  const title = watch("title");
  const description = watch("description");

  // Get the current form value
  useEffect(() => {
    const SAVE_DELAY = 1000;

    const saveTimeout = setTimeout(() => {
      if (isDirty) {
        saveProposalDraft(title, description);
      }
    }, SAVE_DELAY);

    return () => clearTimeout(saveTimeout);
  }, [title, description, isDirty, saveProposalDraft]);

  // Save draft when component is unmounted
  useEffect(() => {
    return () => {
      if (title || description) {
        saveProposalDraft(title, description);
      }
    };
  }, [saveProposalDraft, title, description]);

  return {
    saveProposalDraft,
    loadProposalDraft,
    clearProposalDraft,
    title,
    description,
  };
}
