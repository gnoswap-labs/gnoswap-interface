import { HttpResponse } from "./http-response";

export interface HttpDeleteRequestParam<T> {
  url: string;
  body?: T;
  auth?: boolean;
}

export interface HttpDeleteRequest {
  delete: <T, R>(params: HttpDeleteRequestParam<T>) => Promise<HttpResponse<R>>;
}
