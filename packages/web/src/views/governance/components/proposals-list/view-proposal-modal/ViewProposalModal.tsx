import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN } from "@common/values/token-constant";
import IconClose from "@components/common/icons/IconCancel";
import { Overlay } from "@components/common/modal/Modal.styles";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import useLockedBody from "@hooks/common/use-lock-body";
import { ProposalItemInfo } from "@repositories/governance";
import { DEVICE_TYPE } from "@styles/media";

import StatusBadge from "../../status-badge/StatusBadge";
import TokenChip from "../../token-chip/TokenChip";
import VotingProgressBar from "../../voting-progress-bar/VotingProgressBar";
import VoteButtons from "./VoteButtons";
import VoteCtaButton from "./VoteCtaButton";

import {
  ModalHeaderWrapper,
  ModalQuorum,
  ProposalContentWrapper,
  ViewProposalModalBackground,
  ViewProposalModalWrapper,
  VotingPowerWrapper,
} from "./ViewProposalModal.styles";
import TypeBadge from "../../type-badge/TypeBadge";


export interface ViewProposalModalProps {
  breakpoint: DEVICE_TYPE;
  proposalDetail: ProposalItemInfo;
  setSelectedProposalId: Dispatch<SetStateAction<number>>;
  isConnected: boolean;
  isSwitchNetwork: boolean;
  handleVote: (voteYes: boolean) => void;
  connectWallet: () => void;
  switchNetwork: () => void;
}

const ViewProposalModal: React.FC<ViewProposalModalProps> = ({
  breakpoint,
  proposalDetail,
  setSelectedProposalId,
  isSwitchNetwork,
  isConnected,
  handleVote,
  connectWallet,
  switchNetwork,
}) => {
  const { t } = useTranslation();
  const [selectedVote, setSelectedVote] = useState(
    proposalDetail.myVote?.type || "",
  );
  useEscCloseModal(() => setSelectedProposalId(0));
  useLockedBody(true);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleResize = () => {
    if (typeof window !== "undefined" && modalRef.current) {
      const height = modalRef.current.getBoundingClientRect().height;
      if (height >= window?.innerHeight) {
        modalRef.current.style.top = "0";
        modalRef.current.style.transform = "translateX(-50%)";
      } else {
        modalRef.current.style.top = "50%";
        modalRef.current.style.transform = "translate(-50%, -50%)";
      }
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modalRef]);

  if (!proposalDetail) return null;

  return (
    <>
      <ViewProposalModalBackground>
        <ViewProposalModalWrapper ref={modalRef}>
          <div className="modal-body">
            <ModalHeaderWrapper>
              <div className="header">
                <div className="title">
                  <span>{`#${proposalDetail.id} ${proposalDetail.title}`}</span>
                  {breakpoint !== DEVICE_TYPE.MOBILE && (
                    <TypeBadge type={proposalDetail.type} />
                  )}
                </div>
                <div
                  className="close-wrap"
                  onClick={() => setSelectedProposalId(0)}
                >
                  <IconClose className="close-icon" />
                </div>
              </div>
              {breakpoint === DEVICE_TYPE.MOBILE && (
                <TypeBadge type={proposalDetail.type} />
              )}
              <div className="active-wrapper">
                <StatusBadge
                  status={proposalDetail.status}
                  time={proposalDetail.time}
                />
              </div>
            </ModalHeaderWrapper>
            <ProposalContentWrapper>
              <div className="content">{proposalDetail.description || ""}</div>
            </ProposalContentWrapper>
            <ModalQuorum>
              <div className="quorum-header">
                <span>{t("Governance:detailModal.quorum")}</span>
                <div className="progress-value">
                  <span>
                    {(
                      proposalDetail.votes.yes + proposalDetail.votes.no
                    ).toLocaleString()}
                  </span>
                  /<div>{proposalDetail.votes.max.toLocaleString()}</div>
                </div>
              </div>
              <VotingProgressBar
                yes={proposalDetail.votes.yes}
                no={proposalDetail.votes.no}
                max={proposalDetail.votes.max}
                hideNumber
              />
            </ModalQuorum>
            <VoteButtons
              breakpoint={breakpoint}
              isVoted={
                proposalDetail.myVote
                  ? proposalDetail.myVote.type !== ""
                  : false
              }
              yesCount={proposalDetail.votes.yes}
              noCount={proposalDetail.votes.no}
              selectedVote={selectedVote}
              setSelectedVote={setSelectedVote}
            />
            <VotingPowerWrapper>
              <span>{t("Governance:detailModal.votingWeight")}</span>
              <div>
                <div className="power-value">
                  {(proposalDetail.votes.yes || 0).toLocaleString()}
                </div>
                <TokenChip tokenInfo={GNS_TOKEN} />
              </div>
            </VotingPowerWrapper>
            <VoteCtaButton
              breakpoint={breakpoint}
              isWalletConnected={isConnected}
              isSwitchNetwork={isSwitchNetwork}
              voteType={proposalDetail.myVote?.type}
              voteWeigth={proposalDetail.myVote?.weight}
              status={proposalDetail.status}
              selectedVote={selectedVote}
              handleVote={handleVote}
              connectWallet={connectWallet}
              switchNetwork={switchNetwork}
            />
          </div>
        </ViewProposalModalWrapper>
      </ViewProposalModalBackground>
      <Overlay onClick={() => setSelectedProposalId(0)} />
    </>
  );
};

export default ViewProposalModal;
