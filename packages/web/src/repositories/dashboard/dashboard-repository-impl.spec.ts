import { NetworkClient } from "@common/clients/network-client";
import { MockStorageClient } from "@common/clients/storage-client/mock-storage-client";
import { dummyActivityData } from "@repositories/activity/responses/activity-responses";
import { DashboardRepositoryImpl } from "./dashboard-repository-impl";

describe("DashboardRepositoryImpl", () => {
  it("unwraps account activity response data", async () => {
    const get = jest.fn().mockResolvedValue({
      status: 200,
      message: "OK",
      data: { data: [dummyActivityData] },
    });
    const repository = new DashboardRepositoryImpl({ get } as unknown as NetworkClient, new MockStorageClient("LOCAL"));

    const activity = await repository.getAccountOnchainActivity({ address: "g1address" });

    expect(activity).toEqual([dummyActivityData]);
    expect(get).toHaveBeenCalledWith({ url: "/users/g1address/activity" });
  });
});
