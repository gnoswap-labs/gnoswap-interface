import { CommonState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";
import { useAtom } from "jotai";
import { useCallback } from "react";
import CreateProposalModal from "../components/proposals-list/create-proposal-modal/CreateProposalModal";

export interface CreateProposalModalOpenOption {
  breakpoint: DEVICE_TYPE;
  myVotingWeight: number;
  proposalCreationThreshold: number;
  executablePackages: {
    pkgName: string;
    pkgPath: string;
  }[];
  executableFunctions: {
    pkgPath: string;
    funcName: string;
    paramNum: number;
  }[];
  proposeTextProposal: (title: string, description: string) => void;
  proposeCommunityPoolSpendProposal: (
    title: string,
    description: string,
    tokenPath: string,
    toAddress: string,
    amount: string,
  ) => void;
  proposeParamChangeProposal: (
    title: string,
    description: string,
    variables: {
      pkgPath: string;
      func: string;
      param: string;
    }[],
  ) => void;
}
export interface CreateProposalModalModel {
  openModal: (options: CreateProposalModalOpenOption) => void;
}

export const useCreateProposalModal = (): CreateProposalModalModel => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const setIsOpenCreateModal = useCallback((opened: boolean) => {
    setOpenedModal(opened);
  }, []);

  const openModal = useCallback((options: CreateProposalModalOpenOption) => {
    setModalContent(
      <CreateProposalModal
        setIsOpenCreateModal={setIsOpenCreateModal}
        {...options}
      />,
    );
    setOpenedModal(true);
  }, []);

  return {
    openModal,
  };
};
