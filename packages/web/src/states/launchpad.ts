import { atom } from "jotai";

export const selectLaunchpadPool = atom<number | null>(null);

export const isViewMoreActiveProjects = atom<boolean>(false);
