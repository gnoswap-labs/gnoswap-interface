import { HttpResponse } from "./http-response";

export interface HttpPutRequestParam<T> {
  url: string;
  body?: T;
  auth?: boolean;
}

export interface HttpPutRequest {
  put: <T, R>(params: HttpPutRequestParam<T>) => Promise<HttpResponse<R>>;
}
