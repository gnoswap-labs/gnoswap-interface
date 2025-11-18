/* eslint-disable @typescript-eslint/no-explicit-any */
import { LaunchpadProjectModel, LaunchpadPoolModel } from "@models/launchpad";
import { SortDirection, TABLE_HEAD } from "@layouts/launchpad/components/launchpad-project-list/types";
import { getSortFunction } from "./launchpad-sort-utils";

const createMockPool = (overrides: Partial<LaunchpadPoolModel> = {}): LaunchpadPoolModel => ({
  id: 1,
  projectPoolID: "pool_1",
  status: "ONGOING",
  poolTier: "TIER_30",
  allocation: 1000,
  participant: 100,
  depositAmount: 500,
  distributedAmount: 0,
  apr: 10.5,
  createTime: "2024-01-01T00:00:00Z",
  createBlockHeight: 1000000,
  startTime: "2024-01-01T00:00:00Z",
  startBlockHeight: 1000000,
  endTime: "2024-01-31T23:59:59Z",
  endBlockHeight: 1100000,
  claimableThreshold: 100,
  ...overrides,
});

const createMockProject = (overrides: Partial<LaunchpadProjectModel> = {}): LaunchpadProjectModel => ({
  id: 1,
  projectID: "project_1",
  status: "ONGOING",
  name: "Test Project",
  rewardTokenPath: "gno.land/r/demo/test",
  rewardTokenSymbol: "TEST",
  rewardTokenDecimals: 6,
  rewardTokenLogoURL: "https://example.com/logo.png",
  description: "Test project description",
  pools: [createMockPool()],
  ...overrides,
});

describe("getSortFunction", () => {
  const mockProjects = [
    createMockProject({
      name: "Alpha Project",
      status: "ONGOING",
      pools: [
        createMockPool({
          id: 1,
          apr: 15.5,
          participant: 200,
          allocation: 2000,
          depositAmount: 1000,
        }),
      ],
    }),
    createMockProject({
      name: "Beta Project",
      status: "ENDED",
      pools: [
        createMockPool({
          id: 2,
          apr: 8.2,
          participant: 150,
          allocation: 1500,
          depositAmount: 800,
        }),
      ],
    }),
    createMockProject({
      name: "Gamma Project",
      status: "UPCOMING",
      pools: [
        createMockPool({
          id: 3,
          apr: 22.1,
          participant: 300,
          allocation: 3000,
          depositAmount: 1200,
        }),
      ],
    }),
  ];

  describe("Sorting PROJECT", () => {
    it("ProjectName Ascending", () => {
      const sortFn = getSortFunction(TABLE_HEAD.PROJECT, SortDirection.ASC);
      const sorted = [...mockProjects].sort(sortFn);

      expect(sorted.map(p => p.name)).toEqual(["Alpha Project", "Beta Project", "Gamma Project"]);
    });

    it("ProjectName Descending", () => {
      const sortFn = getSortFunction(TABLE_HEAD.PROJECT, SortDirection.DESC);
      const sorted = [...mockProjects].sort(sortFn);

      expect(sorted.map(p => p.name)).toEqual(["Gamma Project", "Beta Project", "Alpha Project"]);
    });

    it("should handle projects with empty names", () => {
      const projectsWithEmpty = [
        createMockProject({ name: "Zebra" }),
        createMockProject({ name: "" }),
        createMockProject({ name: "Alpha" }),
      ];

      const sortFn = getSortFunction(TABLE_HEAD.PROJECT, SortDirection.ASC);
      const sorted = [...projectsWithEmpty].sort(sortFn);

      expect(sorted.map(p => p.name)).toEqual(["", "Alpha", "Zebra"]);
    });

    it("should handle projects with null/undefined names", () => {
      const projectsWithNull = [
        createMockProject({ name: "Beta" }),
        createMockProject({ name: null as any }),
        createMockProject({ name: undefined as any }),
        createMockProject({ name: "Alpha" }),
      ];

      const sortFn = getSortFunction(TABLE_HEAD.PROJECT, SortDirection.ASC);
      const sorted = [...projectsWithNull].sort(sortFn);

      // null/undefined should be treated as empty strings and come first
      expect(sorted[0].name).toBeNull();
      expect(sorted[1].name).toBeUndefined();
      expect(sorted[2].name).toBe("Alpha");
      expect(sorted[3].name).toBe("Beta");
    });
  });

  describe("Sorting STATUS", () => {
    it("STATUS Ascending", () => {
      const sortFn = getSortFunction(TABLE_HEAD.STATUS, SortDirection.ASC);
      const sorted = [...mockProjects].sort(sortFn);

      expect(sorted.map(p => p.status)).toEqual(["ENDED", "ONGOING", "UPCOMING"]);
    });

    it("STATUS Descending", () => {
      const sortFn = getSortFunction(TABLE_HEAD.STATUS, SortDirection.DESC);
      const sorted = [...mockProjects].sort(sortFn);

      expect(sorted.map(p => p.status)).toEqual(["UPCOMING", "ONGOING", "ENDED"]);
    });
  });

  describe("Sorting APR", () => {
    it("APR Ascending", () => {
      const sortFn = getSortFunction(TABLE_HEAD.APR, SortDirection.ASC);
      const sorted = [...mockProjects].sort(sortFn);

      // APR: 8.2(Beta), 15.5(Alpha), 22.1(Gamma)
      expect(sorted.map(p => p.name)).toEqual(["Beta Project", "Alpha Project", "Gamma Project"]);
    });

    it("APR Descending", () => {
      const sortFn = getSortFunction(TABLE_HEAD.APR, SortDirection.DESC);
      const sorted = [...mockProjects].sort(sortFn);

      // APR: 22.1(Gamma), 15.5(Alpha), 8.2(Beta)
      expect(sorted.map(p => p.name)).toEqual(["Gamma Project", "Alpha Project", "Beta Project"]);
    });

    it("should sort by maximum APR for projects with multiple pools", () => {
      const multiPoolProject = createMockProject({
        name: "Multi Pool Project",
        pools: [
          createMockPool({ id: 1, apr: 5.0, participant: 50, allocation: 500, depositAmount: 250 }),
          createMockPool({ id: 2, apr: 25.5, participant: 100, allocation: 1000, depositAmount: 500 }),
          createMockPool({ id: 3, apr: 10.0, participant: 75, allocation: 750, depositAmount: 375 }),
        ],
      });

      const projects = [mockProjects[0], multiPoolProject]; // Alpha(15.5), Multi(25.5)
      const sortFn = getSortFunction(TABLE_HEAD.APR, SortDirection.DESC);
      const sorted = [...projects].sort(sortFn);

      expect(sorted[0].name).toBe("Multi Pool Project"); // 25.5 is greater than
      expect(sorted[1].name).toBe("Alpha Project");
    });

    it("should handle null APR values", () => {
      const nullAprProject = createMockProject({
        name: "Null APR Project",
        pools: [createMockPool({ apr: null })],
      });

      const projects = [mockProjects[0], nullAprProject]; // Alpha(15.5), Null(-Infinity)
      const sortFn = getSortFunction(TABLE_HEAD.APR, SortDirection.DESC);
      const sorted = [...projects].sort(sortFn);

      expect(sorted[0].name).toBe("Alpha Project");
      expect(sorted[1].name).toBe("Null APR Project");
    });
  });

  describe("Sorting PARTICIPANTS", () => {
    it("PARTICIPANTS Ascending", () => {
      const sortFn = getSortFunction(TABLE_HEAD.PARTICIPANTS, SortDirection.ASC);
      const sorted = [...mockProjects].sort(sortFn);

      // Participants: 150(Beta), 200(Alpha), 300(Gamma)
      expect(sorted.map(p => p.name)).toEqual(["Beta Project", "Alpha Project", "Gamma Project"]);
    });

    it("PARTICIPANTS Descending", () => {
      const sortFn = getSortFunction(TABLE_HEAD.PARTICIPANTS, SortDirection.DESC);
      const sorted = [...mockProjects].sort(sortFn);

      // Participants: 150(Beta), 200(Alpha), 300(Gamma)
      expect(sorted.map(p => p.name)).toEqual(["Gamma Project", "Alpha Project", "Beta Project"]);
    });

    it("should sort by total participants sum for projects with multiple pools", () => {
      const multiPoolProject = createMockProject({
        name: "Multi Pool Project",
        pools: [createMockPool({ id: 1, participant: 100 }), createMockPool({ id: 2, participant: 150 })],
      });

      const projects = [mockProjects[1], multiPoolProject]; // Beta(150), Multi(250)
      const sortFn = getSortFunction(TABLE_HEAD.PARTICIPANTS, SortDirection.DESC);
      const sorted = [...projects].sort(sortFn);

      expect(sorted[0].name).toBe("Multi Pool Project"); // 250 is greater than
      expect(sorted[1].name).toBe("Beta Project");
    });
  });

  describe("Sorting TOTAL_ALLOCATION", () => {
    it("should sort total allocation in descending order", () => {
      const sortFn = getSortFunction(TABLE_HEAD.TOTAL_ALLOCATION, SortDirection.DESC);
      const sorted = [...mockProjects].sort(sortFn);

      // Allocation: 3000(Gamma), 2000(Alpha), 1500(Beta)
      expect(sorted.map(p => p.name)).toEqual(["Gamma Project", "Alpha Project", "Beta Project"]);
    });

    it("should sort by total allocation sum for projects with multiple pools", () => {
      const multiPoolProject = createMockProject({
        name: "Multi Pool Project",
        pools: [createMockPool({ id: 1, allocation: 1000 }), createMockPool({ id: 2, allocation: 2500 })],
      });

      const projects = [mockProjects[0], multiPoolProject]; // Alpha(2000), Multi(3500)
      const sortFn = getSortFunction(TABLE_HEAD.TOTAL_ALLOCATION, SortDirection.DESC);
      const sorted = [...projects].sort(sortFn);

      expect(sorted[0].name).toBe("Multi Pool Project"); // 3500 is greater than
      expect(sorted[1].name).toBe("Alpha Project");
    });
  });

  describe("Sorting TOTAL_DEPOSIT", () => {
    it("should sort total deposit in descending order", () => {
      const sortFn = getSortFunction(TABLE_HEAD.TOTAL_DEPOSIT, SortDirection.DESC);
      const sorted = [...mockProjects].sort(sortFn);

      // Deposit: 1200(Gamma), 1000(Alpha), 800(Beta)
      expect(sorted.map(p => p.name)).toEqual(["Gamma Project", "Alpha Project", "Beta Project"]);
    });

    it("should sort by total deposit sum for projects with multiple pools", () => {
      const multiPoolProject = createMockProject({
        name: "Multi Pool Project",
        pools: [createMockPool({ id: 1, depositAmount: 600 }), createMockPool({ id: 2, depositAmount: 800 })],
      });

      const projects = [mockProjects[0], multiPoolProject]; // Alpha(1000), Multi(1400)
      const sortFn = getSortFunction(TABLE_HEAD.TOTAL_DEPOSIT, SortDirection.DESC);
      const sorted = [...projects].sort(sortFn);

      expect(sorted[0].name).toBe("Multi Pool Project"); // 1400 is greater than
      expect(sorted[1].name).toBe("Alpha Project");
    });
  });
});
