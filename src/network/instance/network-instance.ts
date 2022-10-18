import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { NetworkInstanceConfig } from '.';

export class NetworkInstance {
  private networkInstance: AxiosInstance;

  constructor(config: NetworkInstanceConfig) {
    this.networkInstance = axios.create({
      baseURL: config.host,
      timeout: config.timeout || 1500,
    });
  }

  public get = <T>(url: string) => {
    return this.networkInstance.get<any, AxiosResponse<T>, any>(url);
  };
}
