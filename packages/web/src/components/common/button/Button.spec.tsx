import Button from "./Button";
import { render } from "@testing-library/react";
import { ButtonHierarchy } from "./Button";
import IconDownload from "@components/common/icons/IconDownload";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Button Component", () => {
  it("Primary button", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <Button
            text="Primary"
            style={{
              hierarchy: ButtonHierarchy.Primary,
              width: 130,
              height: 50,
            }}
          />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });

  it("Icon button", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <Button
            leftIcon={<IconDownload />}
            text="Icon Button"
            style={{
              bgColor: "gray50",
              width: 180,
              height: 50,
              justify: "space-between",
              padding: "0px 10px",
              textColor: "colorGreen",
            }}
          />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });

  it("Full width button", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <Button
            leftIcon={<IconDownload />}
            text="Full width button"
            style={{
              bgColor: "gray40",
              fullWidth: true,
              height: 50,
              textColor: "colorWhite",
            }}
          />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
