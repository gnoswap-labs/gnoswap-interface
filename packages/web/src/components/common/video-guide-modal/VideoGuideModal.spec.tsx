import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { VIDEO_GUIDE_TYPES, VideoGuideType } from "@constants/video-guide.constant";

import VideoGuideModal from "./VideoGuideModal";

const mockGetPoolPath = jest.fn((): string | null => null);

jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({ getPoolPath: mockGetPoolPath }),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock("@components/hoc/with-local-modal", () => ({
  __esModule: true,
  default: (ModalContent: unknown) => ModalContent,
}));

const renderGuide = ({
  videoType = VIDEO_GUIDE_TYPES.STAKING,
  poolPath,
}: { videoType?: VideoGuideType; poolPath?: string | null } = {}) =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <VideoGuideModal
          videoType={videoType}
          setIsOpen={jest.fn()}
          {...(poolPath === undefined ? {} : { poolPath })}
        />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

const getActionLink = (actionText: string) => screen.getByText(actionText).closest("a");

describe("VideoGuideModal", () => {
  beforeEach(() => {
    mockGetPoolPath.mockReset();
    mockGetPoolPath.mockReturnValue(null);
  });

  it("uses the resolved pool path when the URL has no pool path", () => {
    renderGuide({ poolPath: "gno.land/r/gnoswap/pool/usdc" });

    expect(getActionLink("common:guide.staking.action")).toHaveAttribute(
      "href",
      "/earn/pool/stake?poolPath=gno.land/r/gnoswap/pool/usdc",
    );
  });

  it("prefers the resolved pool path over a conflicting URL pool path", () => {
    mockGetPoolPath.mockReturnValue("gno.land/r/gnoswap/pool/from-url");
    renderGuide({ poolPath: "gno.land/r/gnoswap/pool/resolved" });

    expect(getActionLink("common:guide.staking.action")).toHaveAttribute(
      "href",
      "/earn/pool/stake?poolPath=gno.land/r/gnoswap/pool/resolved",
    );
  });

  it("uses the URL pool path for callers without a resolved pool path", () => {
    mockGetPoolPath.mockReturnValue("gno.land/r/gnoswap/pool/from-url");
    renderGuide();

    expect(getActionLink("common:guide.staking.action")).toHaveAttribute(
      "href",
      "/earn/pool/stake?poolPath=gno.land/r/gnoswap/pool/from-url",
    );
  });

  it("falls back to earn when neither pool path is available", () => {
    renderGuide();

    expect(getActionLink("common:guide.staking.action")).toHaveAttribute("href", "/earn");
  });

  it("keeps other guide action routes unchanged", () => {
    renderGuide({ videoType: VIDEO_GUIDE_TYPES.POSITION, poolPath: "gno.land/r/gnoswap/pool/resolved" });

    expect(getActionLink("common:guide.position.action")).toHaveAttribute("href", "/earn/add");
  });
});
