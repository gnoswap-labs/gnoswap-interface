export type EventStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Event<T = unknown> {
  id: string;
  status: EventStatus;
  emitNumber: number | null;
  data: T | null;
  onUpdate: (event: Event<T>) => Promise<void>;
  onEmit: (event: Event<T>) => Promise<void>;
}
