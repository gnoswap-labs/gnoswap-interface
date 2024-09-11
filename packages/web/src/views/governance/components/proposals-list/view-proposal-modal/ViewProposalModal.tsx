import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { XGNS_TOKEN } from "@common/values/token-constant";
import IconClose from "@components/common/icons/IconCancel";
import withLocalModal from "@components/hoc/with-local-modal";
import { ProposalItemInfo } from "@repositories/governance";
import { DEVICE_TYPE } from "@styles/media";

import StatusBadge from "../../status-badge/StatusBadge";
import TokenChip from "../../token-chip/TokenChip";
import VotingProgressBar from "../../voting-progress-bar/VotingProgressBar";
import VoteButtons from "./VoteButtons";
import VoteCtaButton from "./VoteCtaButton";

import TypeBadge from "../../type-badge/TypeBadge";
import {
  ModalHeaderWrapper,
  ModalQuorum,
  ProposalContentWrapper,
  ViewProposalModalWrapper,
  VotingPowerWrapper,
} from "./ViewProposalModal.styles";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";

export interface ViewProposalModalProps {
  breakpoint: DEVICE_TYPE;
  proposalDetail: ProposalItemInfo;
  setSelectedProposalId: Dispatch<SetStateAction<number>>;
  isConnected: boolean;
  isSwitchNetwork: boolean;
  connectWallet: () => void;
  switchNetwork: () => void;
  voteProposal: (proposalId: number, voteYes: boolean) => void;
}

const ViewProposalModal: React.FC<ViewProposalModalProps> = ({
  breakpoint,
  proposalDetail,
  setSelectedProposalId,
  isSwitchNetwork,
  isConnected,
  connectWallet,
  switchNetwork,
  voteProposal,
}) => {
  const Modal = useMemo(
    () =>
      withLocalModal(ViewProposalModalWrapper, (isOpen: boolean) => {
        if (!isOpen) setSelectedProposalId(0);
      }),
    [setSelectedProposalId],
  );
  const { t } = useTranslation();
  const [selectedVote, setSelectedVote] = useState(
    proposalDetail.myVote?.type || "",
  );

  if (!proposalDetail) return null;

  return (
    <Modal>
      <div className="modal-body">
        <ModalHeaderWrapper>
          <div className="header">
            <div className="title">
              <span>{`#${proposalDetail.id} ${proposalDetail.title}`}</span>
              {breakpoint !== DEVICE_TYPE.MOBILE && (
                <>
                  <TypeBadge type={proposalDetail.type} />
                  {proposalDetail.status === "EXPIRED" && (
                    <Badge
                      className="proposal-badge"
                      type={BADGE_TYPE.DARK_DEFAULT}
                      text={t("Governance:proposal.status.expired")}
                    />
                  )}
                  {proposalDetail.status === "EXECUTED" && (
                    <Badge
                      className="proposal-badge"
                      type={BADGE_TYPE.DARK_DEFAULT}
                      text={t("Governance:proposal.status.executed")}
                    />
                  )}
                </>
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
            <div className="mobile-badges">
              <TypeBadge type={proposalDetail.type} />
              {proposalDetail.status === "EXPIRED" && (
                <Badge
                  className="proposal-badge"
                  type={BADGE_TYPE.DARK_DEFAULT}
                  text={t("Governance:proposal.status.expired")}
                />
              )}
              {proposalDetail.status === "EXECUTED" && (
                <Badge
                  className="proposal-badge"
                  type={BADGE_TYPE.DARK_DEFAULT}
                  text={t("Governance:proposal.status.executed")}
                />
              )}
            </div>
          )}
          <div className="active-wrapper">
            <StatusBadge
              status={proposalDetail.status}
              time={proposalDetail.time}
            />
          </div>
        </ModalHeaderWrapper>
        <ProposalContentWrapper>
          <div className="content">
            {proposalDetail.type === "COMMUNITY_POOL_SPEND" && (
              <>
                <div className="variable">
                  <div className="variable-type">
                    {t("Governance:detailModal.content.recipient")}
                  </div>
                  {proposalDetail.content.recipient}
                </div>
                <div className="variable">
                  <div className="variable-type">
                    {t("Governance:detailModal.content.amount")}
                  </div>
                  {proposalDetail.content.amount}
                </div>
              </>
            )}
            {proposalDetail.type === "PARAMETER_CHANGE" && (
              <div className="variable">
                <div className="variable-type">
                  {t("Governance:detailModal.content.change")}
                </div>
                {`Pkg Path: "${proposalDetail.content.parameters?.[0].pkgPath}"`}
                <br />
                {`Func: "${proposalDetail.content.parameters?.[0].func}"`}
                <br />
                {`Param: "${proposalDetail.content.parameters
                  ?.map(item => item.param)
                  .join(", ")}"`}
              </div>
            )}
            {`${proposalDetail.content.description.replaceAll("\\n", "\n")}` ||
              ""}
          </div>
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
          votedType={proposalDetail.myVote?.type || ""}
          isClickable={proposalDetail.status === "ACTIVE"}
          yesCount={proposalDetail.votes.yes}
          noCount={proposalDetail.votes.no}
          selectedVote={selectedVote}
          setSelectedVote={setSelectedVote}
        />
        {["UPCOMING", "ACTIVE"].includes(proposalDetail.status) && (
          <>
            <VotingPowerWrapper>
              <span>{t("Governance:detailModal.votingWeight")}</span>
              <div>
                <div className="power-value">
                  {(proposalDetail.myVote?.weight || 0).toLocaleString()}
                </div>
                <TokenChip tokenInfo={XGNS_TOKEN} />
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
              handleVote={() =>
                voteProposal(proposalDetail.id, selectedVote === "YES")
              }
              connectWallet={connectWallet}
              switchNetwork={switchNetwork}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default ViewProposalModal;
