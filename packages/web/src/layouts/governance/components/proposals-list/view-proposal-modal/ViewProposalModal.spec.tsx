import "@testing-library/jest-dom";

import { render, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { nullProposalDetailsInfo, ProposalDetailsInfo } from "@repositories/governance";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";

import ViewProposalModal from "./ViewProposalModal";

const useGetProposalDetails = jest.fn();

jest.mock("@query/governance", () => ({
  useGetProposalDetails: (...args: unknown[]) => useGetProposalDetails(...args),
}));

const setIsModalOpen = jest.fn();

const renderModal = () =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <ViewProposalModal
          address="g1voter"
          proposalId={1}
          breakpoint={DEVICE_TYPE.WEB}
          setIsModalOpen={setIsModalOpen}
          isConnected
          isSwitchNetwork={false}
          getTooltipTextI18nKey={() => "proposal.tooltip.executed"}
          connectWallet={jest.fn()}
          switchNetwork={jest.fn()}
          voteProposal={jest.fn()}
        />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

const mockQueryResult = ({
  data,
  isLoading = false,
  isError = false,
}: {
  data?: ProposalDetailsInfo;
  isLoading?: boolean;
  isError?: boolean;
}) => useGetProposalDetails.mockReturnValue({ data, isLoading, isError });

describe("ViewProposalModal deep link resilience", () => {
  beforeEach(() => jest.clearAllMocks());

  it("closes itself when the proposal is confirmed missing", async () => {
    mockQueryResult({ data: nullProposalDetailsInfo });

    renderModal();

    await waitFor(() => expect(setIsModalOpen).toHaveBeenCalledWith(false));
  });

  it("stays open when the detail request fails", async () => {
    mockQueryResult({ isError: true });

    renderModal();

    await waitFor(() => expect(useGetProposalDetails).toHaveBeenCalled());
    expect(setIsModalOpen).not.toHaveBeenCalled();
  });

  it("stays open while the detail request is in flight", async () => {
    mockQueryResult({ isLoading: true });

    renderModal();

    await waitFor(() => expect(useGetProposalDetails).toHaveBeenCalled());
    expect(setIsModalOpen).not.toHaveBeenCalled();
  });

  it("stays open for an existing proposal", async () => {
    mockQueryResult({
      data: { proposal: { ...nullProposalDetailsInfo.proposal, id: 1, title: "Proposal", status: "ACTIVE" } },
    });

    renderModal();

    await waitFor(() => expect(useGetProposalDetails).toHaveBeenCalled());
    expect(setIsModalOpen).not.toHaveBeenCalled();
  });
});
