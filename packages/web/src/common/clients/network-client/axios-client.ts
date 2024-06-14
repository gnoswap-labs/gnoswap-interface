import { HTTP_5XX_ERROR } from "@constants/common.constant";
import axios, { AxiosResponse } from "axios";
import { NetworkClient } from "./network-client";
import {
  HttpDeleteRequestParam,
  HttpGetRequestParam,
  HttpPostRequestParam,
  HttpPutRequestParam,
  HttpResponse,
} from "./protocols";

export class AxiosClient implements NetworkClient {
  private baseURL: string;
  private serverErrorCb: () => void;

  constructor(baseURL?: string, serverErrorCb?: () => void) {
    this.baseURL = baseURL || "";
    this.serverErrorCb = serverErrorCb ?? (() => { });

    axios.interceptors.response.use((res) => {
      if (HTTP_5XX_ERROR.includes(res.status)) {
        this.serverErrorCb?.();
      }

      return res;
    });
  }

  public get = <R>(params: HttpGetRequestParam): Promise<HttpResponse<R>> => {
    const { url } = params;
    const headers = this.createHeaders();
    return axios
      .get(url, { headers, baseURL: this.baseURL })
      .then(this.createResponse);
  };

  public post = async <T, R>(
    params: HttpPostRequestParam<T>,
  ): Promise<HttpResponse<R>> => {
    const { url, body } = params;
    const headers = this.createHeaders();
    return axios
      .post(url, body, { headers, baseURL: this.baseURL })
      .then(this.createResponse);
  };

  public put = async <T, R>(
    params: HttpPutRequestParam<T>,
  ): Promise<HttpResponse<R>> => {
    const { url, body } = params;
    const headers = this.createHeaders();
    return axios
      .put(url, body, { headers, baseURL: this.baseURL })
      .then(this.createResponse);
  };

  public delete = async <T, R>(
    params: HttpDeleteRequestParam<T>,
  ): Promise<HttpResponse<R>> => {
    const { url } = params;
    const headers = this.createHeaders();
    return axios
      .delete(url, { headers, baseURL: this.baseURL })
      .then(this.createResponse);
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
