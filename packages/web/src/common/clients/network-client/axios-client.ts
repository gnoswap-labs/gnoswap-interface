import axios, { AxiosInstance, AxiosResponse } from "axios";
import { NetworkClient } from "./network-client";
import {
  HttpDeleteRequestParam,
  HttpGetRequestParam,
  HttpPostRequestParam,
  HttpPutRequestParam,
  HttpResponse,
} from "./protocols";

export class AxiosClient implements NetworkClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({ baseURL });
  }

  public get = <R>(params: HttpGetRequestParam): Promise<HttpResponse<R>> => {
    const { url } = params;
    const headers = this.createHeaders();
    return this.client.get(url, { headers }).then(this.createResponse);
  };

  public post = async <T, R>(params: HttpPostRequestParam<T>): Promise<HttpResponse<R>> => {
    const { url, body } = params;
    const headers = this.createHeaders();
    return this.client.post(url, body, { headers }).then(this.createResponse);
  };

  public put = async <T, R>(params: HttpPutRequestParam<T>): Promise<HttpResponse<R>> => {
    const { url, body } = params;
    const headers = this.createHeaders();
    return this.client.put(url, body, { headers }).then(this.createResponse);
  };

  public delete = async <T, R>(params: HttpDeleteRequestParam<T>): Promise<HttpResponse<R>> => {
    const { url } = params;
    const headers = this.createHeaders();
    return this.client.delete(url, { headers }).then(this.createResponse);
  };

  private createHeaders = () => {
    const header = { "Content-Type": "application/json" };
    return header;
  };

  private createResponse = <R>(response: AxiosResponse<R>): HttpResponse<R> => {
    const successStatuses = [200, 201, 203, 204];
    if (!successStatuses.includes(response.status)) {
      throw new Error("Network Error");
    }

    return {
      status: response.status,
      message: response.statusText,
      data: response.data,
    };
  };

  public static createAxiosClient() {
    return new AxiosClient();
  }
}
