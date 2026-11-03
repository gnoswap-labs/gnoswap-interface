import { act, render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import i18next from "i18next";
import { Provider as JotaiProvider } from "jotai";
import React from "react";
import { I18nextProvider } from "react-i18next";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";

import enGovernance from "../../../../../public/locales/en/Governance.json";
import koGovernance from "../../../../../public/locales/ko/Governance.json";
import ruGovernance from "../../../../../public/locales/ru/Governance.json";
import StatusBadge from "./StatusBadge";

jest.mock("@components/common/icons/IconCircleInCancel", () => () => null);
jest.mock("@components/common/icons/IconCircleInCheck", () => () => null);
jest.mock("@components/common/icons/IconInfo", () => () => null);
jest.mock("@components/common/icons/IconOutlineClock", () => () => null);
jest.mock("@components/common/icons/IconPass", () => () => null);

const NOW = new Date("2026-10-29T12:00:00").getTime();
const VOTING_END = NOW - 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const i18n = i18next.createInstance();
i18n.init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { Governance: enGovernance },
    ko: { Governance: koGovernance },
    ru: { Governance: ruGovernance },
  },
  interpolation: { escapeValue: false },
});

const renderBadge = (props: Partial<React.ComponentProps<typeof StatusBadge>> = {}) =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <I18nextProvider i18n={i18n}>
          <StatusBadge breakpoint={DEVICE_TYPE.WEB} status="PASSED" time={VOTING_END} {...props} />
        </I18nextProvider>
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

const formatTime = (time: number) => dayjs(time).format("YYYY-MM-DD, HH:mm:ss");

describe("StatusBadge executable time", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
    i18n.changeLanguage("en");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.each([
    [24 * HOUR - MINUTE, "Executable in 24 hours"],
    [HOUR + 40 * MINUTE, "Executable in 2 hours"],
    [HOUR + 20 * MINUTE, "Executable in 1 hour"],
    [HOUR + 29 * MINUTE + 30 * 1000, "Executable in 1 hour"],
    [HOUR + 30 * MINUTE, "Executable in 2 hours"],
    [59 * MINUTE + 40 * 1000, "Executable in 1 hour"],
    [30 * MINUTE, "Executable in 30 minutes"],
    [30 * 1000, "Executable in 1 minute"],
  ])("shows remaining time for %i ms", (remaining, expected) => {
    const executableTime = NOW + remaining;
    renderBadge({ executableTime });

    expect(
      screen.getByText(`Voting Ended (${formatTime(VOTING_END)}), ${expected} (${formatTime(executableTime)})`),
    ).toBeTruthy();
  });

  it("updates the remaining time while the page stays open", () => {
    const { rerender } = renderBadge({ breakpoint: DEVICE_TYPE.MOBILE, executableTime: NOW + 30 * MINUTE });
    expect(screen.getByText("Voting Ended, Executable in 30 minutes")).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(10 * MINUTE);
    });
    rerender(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <I18nextProvider i18n={i18n}>
            <StatusBadge
              breakpoint={DEVICE_TYPE.MOBILE}
              status="PASSED"
              time={VOTING_END}
              executableTime={NOW + 30 * MINUTE}
            />
          </I18nextProvider>
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
    expect(screen.getByText("Voting Ended, Executable in 20 minutes")).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(20 * MINUTE);
    });
    expect(screen.getByText("Voting Ended")).toBeTruthy();
  });

  it("hides absolute times on mobile", () => {
    renderBadge({ breakpoint: DEVICE_TYPE.MOBILE, executableTime: NOW + 3 * HOUR });

    expect(screen.getByText("Voting Ended, Executable in 3 hours")).toBeTruthy();
  });

  it("keeps the voting ended text once the executable time has passed", () => {
    renderBadge({ executableTime: NOW - MINUTE });

    expect(screen.getByText(`Voting Ended (${formatTime(VOTING_END)})`)).toBeTruthy();
  });

  it("keeps the voting ended text without an executable time", () => {
    renderBadge({ executableTime: null });

    expect(screen.getByText(`Voting Ended (${formatTime(VOTING_END)})`)).toBeTruthy();
  });

  it("does not show the executable time for other statuses", () => {
    renderBadge({ status: "REJECTED", executableTime: NOW + 3 * HOUR });

    expect(screen.queryByText(/Executable in/)).toBeNull();
  });

  it.each([
    ["ko", 3 * HOUR, koGovernance.proposal.time.executableInHours_other.replace("{{count}}", "3")],
    ["ru", 2 * HOUR, ruGovernance.proposal.time.executableInHours_few.replace("{{count}}", "2")],
    ["ru", 5 * MINUTE, ruGovernance.proposal.time.executableInMinutes_many.replace("{{count}}", "5")],
  ])("uses localized plural forms in %s", (lng, remaining, expected) => {
    i18n.changeLanguage(lng);
    renderBadge({ breakpoint: DEVICE_TYPE.MOBILE, executableTime: NOW + remaining });

    expect(
      screen.getByText(`${i18n.t("Governance:proposal.time.ended", { rel_time: "" }).trim()}, ${expected}`),
    ).toBeTruthy();
  });
});
