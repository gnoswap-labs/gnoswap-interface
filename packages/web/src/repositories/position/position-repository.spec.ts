import { NetworkClient } from "@common/clients/network-client";
import {
  HttpDeleteRequestParam,
  HttpGetRequestParam,
  HttpPostRequestParam,
  HttpPutRequestParam,
  HttpResponse,
} from "@common/clients/network-client/protocols";
import { PositionRepositoryImpl } from "./position-repository-impl";

class MockNetworkClient implements NetworkClient {
  public getCalls: HttpGetRequestParam[] = [];

  public async get<R>(params: HttpGetRequestParam): Promise<HttpResponse<R>> {
    this.getCalls.push(params);

    return {
      status: 200,
      message: "Success",
      data: { data: [] } as R,
    };
  }

  public async post<T, R>(params: HttpPostRequestParam<T>): Promise<HttpResponse<R>> {
    void params;

    return {
      status: 200,
      message: "Success",
      data: {} as R,
    };
  }

  public async put<T, R>(params: HttpPutRequestParam<T>): Promise<HttpResponse<R>> {
    void params;

    return {
      status: 200,
      message: "Success",
      data: {} as R,
    };
  }

  public async delete<T, R>(params: HttpDeleteRequestParam<T>): Promise<HttpResponse<R>> {
    void params;

    return {
      status: 200,
      message: "Success",
      data: {} as R,
    };
  }
}

describe("PositionRepositoryImpl", () => {
  it("uses binSize query parameter for position bins", async () => {
    const networkClient = new MockNetworkClient();
    const repository = new PositionRepositoryImpl(networkClient, null, null);

    await repository.getPositionBins("123", 40);

    expect(networkClient.getCalls).toEqual([
      {
        url: "/positions/123/bins?binSize=40",
      },
    ]);
  });
});
