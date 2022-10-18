import axios, { AxiosInstance } from 'axios';
import { NetworkInstanceConfig } from '.';

export class NetworkInstance {
  private axiosInstance: AxiosInstance;

  constructor(config: NetworkInstanceConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.host,
      timeout: config.timeout || 1500,
    });
  }

  public get = (url: string) => {
    return this.axiosInstance.get(url);
  };
}
