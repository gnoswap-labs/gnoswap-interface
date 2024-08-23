export type EventStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Event<T = unknown> {
  id: string;
  status: EventStatus;
  emitNumber: number | null;
  data: T | null;
  callback: (event: Event<T>) => Promise<void>;
}
