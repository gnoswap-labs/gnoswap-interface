import { HttpResponse } from "./http-response";

export interface HttpGetRequestParam {
  url: string;
  auth?: boolean;
  timeout?: number;
}

export interface HttpGetRequest {
  get: <R>(params: HttpGetRequestParam) => Promise<HttpResponse<R>>;
}
