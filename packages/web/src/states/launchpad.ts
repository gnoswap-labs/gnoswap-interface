import { atom } from "jotai";

import { LaunchpadProjectConditionModel } from "@models/launchpad";

export const participateAmount = atom<string>("");

export const selectLaunchpadPool = atom<number | null>(null);

export const depositConditions = atom<LaunchpadProjectConditionModel[]>([]);

export const isViewMoreActiveProjects = atom<boolean>(false);

export const isShowConditionTooltip = atom<boolean>(false);
