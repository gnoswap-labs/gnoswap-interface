import { HttpDeleteRequest, HttpGetRequest, HttpPostRequest, HttpPutRequest } from "./protocols";

export interface NetworkClient extends HttpGetRequest, HttpPostRequest, HttpPutRequest, HttpDeleteRequest {}
