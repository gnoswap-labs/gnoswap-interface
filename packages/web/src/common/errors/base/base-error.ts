interface BaseErrorParams {
  type: string;
  status: number;
  message?: string;
}

export class BaseError extends Error {
  private status: number;

  private type: string;

  private occurredAt: number;

  constructor(errorInfo: BaseErrorParams) {
    const { type, status } = errorInfo;
    super(`${type} (status: ${status})`);
    this.status = status;
    this.type = type;
    this.occurredAt = Date.now();
    this.message = errorInfo.message ?? `${type}`;
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  public getStatus = () => {
    return this.status;
  };

  public getType = () => {
    return this.type;
  };

  public getOccurredAt = () => {
    return this.occurredAt;
  };
}
