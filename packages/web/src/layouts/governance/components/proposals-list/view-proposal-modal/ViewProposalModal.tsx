import React, { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { GNS_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconClose from "@components/common/icons/IconCancel";
import withLocalModal from "@components/hoc/with-local-modal";
import { useWindowSize } from "@hooks/common/use-window-size";
import { Proposal2ItemInfo, PROPOSAL_TYPE } from "@repositories/governance";
import { DEVICE_TYPE } from "@styles/media";
import { useGetProposalDetails } from "@query/governance";

import StatusBadge from "../../status-badge/StatusBadge";
import TokenChip from "../../token-chip/TokenChip";
import TypeBadge from "../../type-badge/TypeBadge";
import VotingProgressBar from "../../voting-progress-bar/VotingProgressBar";
import VoteButtons from "./VoteButtons";
import VoteCtaButton from "./VoteCtaButton";
import IconPassed from "@components/common/icons/IconPassed";
import { ProposalTooltipContent } from "../../voting-progress-bar/VotingProgressBar.styles";

import {
  ModalHeaderWrapper,
  ModalQuorum,
  ProposalContentWrapper,
  ViewProposalModalWrapper,
  VotingPowerWrapper,
} from "./ViewProposalModal.styles";
import Tooltip from "@components/common/tooltip/Tooltip";

export interface ViewProposalModalProps {
  breakpoint: DEVICE_TYPE;
  proposalDetail: Proposal2ItemInfo;
  setIsModalOpen: (isOpen: boolean) => void;
  isConnected: boolean;
  isSwitchNetwork: boolean;
  getTooltipTextI18nKey: (status: string, isMajorityVoted: boolean, yesVotes: number, noVotes: number) => string;
  connectWallet: () => void;
  switchNetwork: () => void;
  voteProposal: (proposalId: number, voteYes: boolean) => void;
}

const ViewProposalModal: React.FC<ViewProposalModalProps> = ({
  breakpoint,
  proposalDetail,
  setIsModalOpen,
  isSwitchNetwork,
  isConnected,
  getTooltipTextI18nKey,
  connectWallet,
  switchNetwork,
  voteProposal,
}) => {
  const Modal = useMemo(
    () =>
      withLocalModal(ViewProposalModalWrapper, (isOpen: boolean) => {
        if (!isOpen) setIsModalOpen(false);
      }),
    [setIsModalOpen],
  );

  const { data } = useGetProposalDetails({ proposalId: 1 });
  console.log(data, "dat?????!");

  const { numericVotingInfo, userVotingInfo } = useMemo(() => {
    const {
      votingInfo: { maxVotingWeight, yesVotingWeight, noVotingWeight, quorumAmount },
      userVotingInfo,
    } = proposalDetail;

    return {
      numericVotingInfo: {
        maxVotingWeight: Number(maxVotingWeight) || 0,
        yesVotingWeight: Number(yesVotingWeight) || 0,
        noVotingWeight: Number(noVotingWeight) || 0,
        quorumAmount: Number(quorumAmount) || 0,
      },
      userVotingInfo,
    };
  }, [proposalDetail]);

  const { t } = useTranslation();
  const { isMobile } = useWindowSize();
  const [selectedVote, setSelectedVote] = useState(userVotingInfo?.voteType || "");

  const hasVoted = useMemo(() => {
    const { yesVotingWeight, noVotingWeight } = numericVotingInfo;
    return Boolean(yesVotingWeight) || Boolean(noVotingWeight);
  }, [numericVotingInfo]);

  const isMajorityVoted = useMemo(() => {
    const { yesVotingWeight, noVotingWeight, maxVotingWeight } = numericVotingInfo;

    if (maxVotingWeight === 0) return false;

    return yesVotingWeight + noVotingWeight >= maxVotingWeight / 2;
  }, [numericVotingInfo]);

  const { yesVotes, noVotes } = useMemo(() => {
    if (proposalDetail.status === "CANCELLED") {
      return { yesVotes: 0, noVotes: 0 };
    }
    return {
      yesVotes: numericVotingInfo.yesVotingWeight,
      noVotes: numericVotingInfo.noVotingWeight,
    };
  }, [proposalDetail.status, numericVotingInfo]);

  const tooltipTextI18nKey = React.useMemo(() => {
    return getTooltipTextI18nKey(proposalDetail.status, isMajorityVoted, yesVotes, noVotes);
  }, [proposalDetail.status, getTooltipTextI18nKey, isMajorityVoted, yesVotes, noVotes]);

  if (!proposalDetail) return null;

  const hasVoteButton = ["UPCOMING", "ACTIVE"].includes(proposalDetail.status);

  return (
    <Modal>
      <div className="modal-body">
        <ModalHeaderWrapper>
          <div className="header">
            <div className="title">
              <span>{`#${proposalDetail.id} ${proposalDetail.title}`}</span>
              {breakpoint !== DEVICE_TYPE.MOBILE && (
                <>
                  <TypeBadge type={proposalDetail.proposalType} />
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
            <div className="close-wrap" onClick={() => setIsModalOpen(false)}>
              <IconClose className="close-icon" />
            </div>
          </div>
          {breakpoint === DEVICE_TYPE.MOBILE && (
            <div className="mobile-badges">
              <TypeBadge type={proposalDetail.proposalType} />
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
              breakpoint={breakpoint}
              status={proposalDetail.status}
              time={proposalDetail.executableTime}
              twoline={false}
            />
          </div>
        </ModalHeaderWrapper>
        <ProposalContentWrapper
          style={{
            maxHeight: hasVoteButton ? (isMobile ? "368px" : "329px") : isMobile ? "499px" : "486px",
          }}
        >
          <div className="content">
            {proposalDetail.proposalType === PROPOSAL_TYPE.PROPOSAL_COMMUNITY_POOL_SPEND && (
              <>
                <div className="variable">
                  <div className="variable-type">{t("Governance:detailModal.content.recipient")}</div>
                  {/* {proposalDetail.content.recipient} */}
                </div>
                <div className="variable">
                  <div className="variable-type">{t("Governance:detailModal.content.amount")}</div>
                  {/* {rawToDisplayAmount(proposalDetail.content.amount || 0, GNS_TOKEN.decimals).toLocaleString()}{" "} */}
                  {GNS_TOKEN.symbol}
                </div>
              </>
            )}
            {proposalDetail.proposalType === PROPOSAL_TYPE.PROPOSAL_PARAMETER_CHANGE && (
              <div className="variable">
                <div className="variable-type">{t("Governance:detailModal.content.change")}</div>
                {/* {proposalDetail.content.parameters?.map(item => (
                  <>
                    {`Pkg Path: "${item.pkgPath}", Func: "${item.func}", Params: "${item.param}"`}
                    <br />
                  </>
                ))} */}
              </div>
            )}
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-style">
              {/* {`${proposalDetail.content.description.replaceAll("\\n", "\n")}`} */}
            </ReactMarkdown>
          </div>
        </ProposalContentWrapper>
        <ModalQuorum>
          <div className="quorum-header">
            <span>{t("Governance:detailModal.quorum")}</span>
            <div className="progress-value">
              <Tooltip
                placement="top"
                forcedClose={!hasVoted}
                FloatingContent={
                  <ProposalTooltipContent>
                    <Trans ns="Governance" components={{ br: <br /> }} i18nKey={tooltipTextI18nKey} />
                  </ProposalTooltipContent>
                }
              >
                <span className={isMajorityVoted ? "passed" : ""}>
                  {isMajorityVoted && <IconPassed />}
                  {(yesVotes + noVotes).toLocaleString()}
                </span>
              </Tooltip>
              /<div>{numericVotingInfo.maxVotingWeight.toLocaleString()}</div>
            </div>
          </div>
          <VotingProgressBar
            yes={numericVotingInfo.yesVotingWeight}
            no={numericVotingInfo.noVotingWeight}
            max={numericVotingInfo.maxVotingWeight}
            isMajorityVoted={isMajorityVoted}
            hideNumber
          />
        </ModalQuorum>
        <VoteButtons
          breakpoint={breakpoint}
          votedType={userVotingInfo.voteType || ""}
          isClickable={proposalDetail.status === "ACTIVE"}
          yesCount={numericVotingInfo.yesVotingWeight}
          noCount={numericVotingInfo.noVotingWeight}
          selectedVote={selectedVote}
          setSelectedVote={setSelectedVote}
        />
        {hasVoteButton && (
          <>
            <VotingPowerWrapper>
              <span>{t("Governance:detailModal.votingWeight")}</span>
              <div>
                <div className="power-value">{(userVotingInfo.votingWeight || 0).toLocaleString()}</div>
                <TokenChip tokenInfo={XGNS_TOKEN} />
              </div>
            </VotingPowerWrapper>
            <VoteCtaButton
              breakpoint={breakpoint}
              isWalletConnected={isConnected}
              isSwitchNetwork={isSwitchNetwork}
              voteType={userVotingInfo.voteType}
              voteWeigth={userVotingInfo.votingWeight}
              status={proposalDetail.status}
              selectedVote={selectedVote}
              handleVote={() => {
                voteProposal(proposalDetail.id, selectedVote === "YES");
                setIsModalOpen(false);
              }}
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
