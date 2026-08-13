import { render, screen } from "@testing-library/react";

import { usePositionData } from "@hooks/pool/data/use-position-data";

import WalletMyPositionsHeader from "./WalletMyPositionsHeader";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ isSwitchNetwork: false }),
}));

jest.mock("@hooks/pool/data/use-position-data", () => ({
  usePositionData: jest.fn(),
}));

jest.mock("@components/common/switch/Switch", () => ({
  __esModule: true,
  default: () => <input type="checkbox" readOnly />,
}));

jest.mock("./WalletMyPositionsHeader.styles", () => ({
  wrapper: {},
}));

const mockUsePositionData = usePositionData as jest.Mock;

describe("WalletMyPositionsHeader", () => {
  beforeEach(() => {
    mockUsePositionData.mockImplementation(({ withClosed }: { withClosed?: boolean }) => ({
      isFetchedPosition: true,
      isPositionDataAvailable: true,
      totalPositionCount: withClosed ? 3 : 2,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("uses the open position count and hides the switch when no closed positions exist", () => {
    mockUsePositionData.mockImplementation(({ withClosed }: { withClosed?: boolean }) => ({
      isFetchedPosition: true,
      isPositionDataAvailable: true,
      totalPositionCount: withClosed ? 2 : 2,
    }));

    render(<WalletMyPositionsHeader toggleClosed={jest.fn()} isClosed={false} />);

    expect(screen.getByRole("heading")).toHaveTextContent("Wallet:myPosi (2)");
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(mockUsePositionData).toHaveBeenNthCalledWith(1, {
      withClosed: false,
      page: 1,
      limit: 1,
      scopeId: "WalletMyPositionsHeader-open",
    });
    expect(mockUsePositionData).toHaveBeenNthCalledWith(2, {
      withClosed: true,
      page: 1,
      limit: 1,
      scopeId: "WalletMyPositionsHeader-all",
    });
  });

  it("shows the switch when a closed position exists outside the current page", () => {
    render(<WalletMyPositionsHeader toggleClosed={jest.fn()} isClosed={false} />);

    expect(screen.getByRole("heading")).toHaveTextContent("Wallet:myPosi (2)");
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("uses the inclusive position count when closed positions are shown", () => {
    render(<WalletMyPositionsHeader toggleClosed={jest.fn()} isClosed={true} />);

    expect(screen.getByRole("heading")).toHaveTextContent("Wallet:myPosi (3)");
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("keeps the header available while the position queries are transitioning", () => {
    mockUsePositionData.mockImplementation(({ withClosed }: { withClosed?: boolean }) => ({
      isFetchedPosition: false,
      isPositionDataAvailable: true,
      totalPositionCount: withClosed ? 3 : 2,
    }));

    render(<WalletMyPositionsHeader toggleClosed={jest.fn()} isClosed={true} />);

    expect(screen.getByRole("heading")).toHaveTextContent("Wallet:myPosi (3)");
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("hides the header while position data is unavailable", () => {
    mockUsePositionData.mockReturnValue({
      isFetchedPosition: true,
      isPositionDataAvailable: false,
      totalPositionCount: 0,
    });

    render(<WalletMyPositionsHeader toggleClosed={jest.fn()} isClosed={false} />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
