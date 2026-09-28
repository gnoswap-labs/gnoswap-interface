import { fireEvent, render, screen } from "@testing-library/react";

import { StakePositionContent } from "./StakePositionContent";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe("StakePositionContent", () => {
  const props = { onClick: jest.fn(), close: jest.fn() };

  it("shows the local placeholder instead of an empty image source", () => {
    render(<StakePositionContent {...props} content={{ logoUrl: "" }} />);
    expect(screen.getByRole("img", { hidden: true })).toHaveAttribute("src", "/fallback-logo.svg");
  });

  it("replaces a failed NFT image with the local placeholder", () => {
    render(<StakePositionContent {...props} content={{ logoUrl: "/missing-nft.svg" }} />);
    const image = screen.getByRole("img", { hidden: true });
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", "/fallback-logo.svg");
  });
});
