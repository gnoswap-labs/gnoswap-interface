import { Event, EventStatus } from ".";

export interface EventStore<T = unknown> {
  addEvent: (
    id: string,
    onUpdate: (event: Event<T>) => Promise<void>,
    onEmit: (event: Event<T>) => Promise<void>,
  ) => Event<T>;

  getEvent: (id: string) => Event<T> | null;

  hasEvent: (id: string) => boolean;

  emitEvent: (id: string) => Promise<boolean>;

  emitAllEvents: (emitNumber: number) => Promise<Event<T>[]>;

  updatePendingEvents: () => Promise<Event<T>[]>;

  removeEvent: (id: string) => Event<T> | null;

  removeAllEvents: () => void;

  count: () => number;

  list: () => string[];

  getStatus: (id: string) => EventStatus | null;
}
