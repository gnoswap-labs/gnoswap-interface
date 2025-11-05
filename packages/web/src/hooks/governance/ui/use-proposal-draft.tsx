import { useCallback, useEffect, useRef } from "react";
import { UseFormWatch, UseFormSetValue, FieldValues, Path } from "react-hook-form";

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

interface UseProposalDraftProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  isDirty: boolean;
}

/**
 * @param setValue - react-hook-form (setValue function)
 * @param watch - react-hook-form (watch function)
 * @param isDirty - react-hook-form (Whether the form has changed)
 * @returns Draft management functions and their current values
 */
export function useProposalDraft<T extends FieldValues>({ setValue, watch, isDirty }: UseProposalDraftProps<T>) {
  const isSubmittedRef = useRef(false);

  const FORM_FIELDS = {
    title: "title" as Path<T>,
    description: "description" as Path<T>,
  } as const;

  const saveProposalDraft = useCallback((title: string, description: string) => {
    if (!title && !description) return;
    if (isSubmittedRef.current) return;

    const draft: ProposalDraft = {
      title,
      description,
      lastModified: Date.now(),
    };

    localStorage.setItem(GNOSWAP_PROPOSAL_DRAFT_KEY, JSON.stringify(draft));
  }, []);

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

  const clearProposalDraft = useCallback(() => {
    isSubmittedRef.current = true;
    localStorage.removeItem(GNOSWAP_PROPOSAL_DRAFT_KEY);
  }, []);

  // Load saved drafts when mounting components
  useEffect(() => {
    const draft = loadProposalDraft();
    if (draft) {
      setValue(FORM_FIELDS.title, draft.title as T[Path<T>], { shouldDirty: true, shouldValidate: true });
      setValue(FORM_FIELDS.description, draft.description as T[Path<T>], { shouldDirty: true, shouldValidate: true });
    }
  }, [loadProposalDraft, setValue]);

  const title = watch(FORM_FIELDS.title) as string;
  const description = watch(FORM_FIELDS.description) as string;

  // Auto-save functionality
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
      if (!isSubmittedRef.current && (title || description)) {
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
