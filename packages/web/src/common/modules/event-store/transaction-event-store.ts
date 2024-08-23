import { Axios } from "axios";
import { Event, EventStore, EventStatus } from ".";
import { makeHexByBase64, parseABCIValue } from "./utility";

type ResponseDataType = string[];

export class TransactionEventStore implements EventStore<ResponseDataType> {
  private networkClient: Axios;

  private events: Map<string, Event<ResponseDataType>>;

  constructor(networkClient: Axios) {
    this.events = new Map();
    this.networkClient = networkClient;
  }

  /**
   * Adds a new event to the store with the given ID, emit number, and callback.
   * The event is initially set to the 'PENDING' status.
   * @param transactionHash - Unique identifier for the event.
   * @param blockHeight - Number of times the event can be emitted before it is removed.
   * @param callback - The function to be called when the event is emitted.
   * @returns The added event.
   */
  addEvent(
    transactionHash: string,
    callback: (event: Event<ResponseDataType>) => Promise<void>,
  ): Event<ResponseDataType> {
    const event: Event<ResponseDataType> = {
      id: transactionHash,
      status: "PENDING",
      emitNumber: null,
      data: null,
      callback,
    };
    this.events.set(transactionHash, event);
    return event;
  }

  /**
   * Retrieves an event by its ID.
   * @param transactionHash - Unique identifier for the event.
   * @returns The event if found, otherwise null.
   */
  getEvent(transactionHash: string): Event<ResponseDataType> | null {
    return this.events.get(transactionHash) || null;
  }

  /**
   * Checks if an event with the given ID exists in the store.
   * @param transactionHash - Unique identifier for the event.
   * @returns True if the event exists, otherwise false.
   */
  hasEvent(transactionHash: string): boolean {
    return this.events.has(transactionHash);
  }

  /**
   * Emits the event with the given ID. The event's callback is executed,
   * and its blockHeight is decremented. The event's status is updated based
   * on whether it was successfully emitted or if an error occurred.
   * @param transactionHash - Unique identifier for the event.
   * @returns True if the event was successfully emitted, otherwise false.
   */
  async emitEvent(transactionHash: string): Promise<boolean> {
    const event = this.events.get(transactionHash);
    if (!event || event.emitNumber === null || event.status === "PENDING") {
      return false;
    }

    try {
      await event.callback(event);
    } catch (error) {
      console.error(
        `Error executing callback for event ${transactionHash}:`,
        error,
      );
    }

    this.events.delete(transactionHash);
    return true;
  }

  /**
   * Emits all events that have the smaller emit number than blockHeight.
   * The callback of each matching event is executed.
   * @param blockHeight - Emit events with a smaller emit number than blockHeight.
   * @returns An array of event IDs that were successfully emitted.
   */
  async emitAllEvents(blockHeight: number): Promise<Event<ResponseDataType>[]> {
    const triggeredEvents: Event<ResponseDataType>[] = [];
    console.log("emitted", this.events);

    for (const [transactionHash, event] of this.events.entries()) {
      if (event.emitNumber === null) {
        continue;
      }

      if (blockHeight >= event.emitNumber) {
        const success = await this.emitEvent(transactionHash);
        if (success) {
          triggeredEvents.push(event);
        }
      }
    }

    return triggeredEvents;
  }

  async updatePendingEvents(): Promise<Promise<Event<ResponseDataType>[]>> {
    const pendingEvents = Array.from(this.events.values()).filter(
      event => event.status === "PENDING",
    );

    const updatedEvents = await Promise.all(
      pendingEvents.map(event =>
        this.getTransactionResult(event.id)
          .then<Event<ResponseDataType> | null>(result => {
            if (!result) {
              return null;
            }

            const status = !result.hasError ? "SUCCESS" : "FAILED";
            return {
              ...event,
              status,
              emitNumber: result?.height || null,
              data: result?.data || null,
            };
          })
          .catch(() => null),
      ),
    );

    for (const updatedEvent of updatedEvents) {
      if (updatedEvent) {
        this.events.set(updatedEvent.id, updatedEvent);
      }
    }

    return updatedEvents.filter(event => event !== null);
  }

  /**
   * Removes an event by its ID from the store.
   * @param transactionHash - Unique identifier for the event.
   * @returns The removed event if it existed, otherwise null.
   */
  removeEvent(transactionHash: string): Event<ResponseDataType> | null {
    const event = this.events.get(transactionHash);
    if (!event) return null;

    this.events.delete(transactionHash);
    return event;
  }

  /**
   * Removes all events from the store.
   */
  removeAllEvents(): void {
    this.events.clear();
  }

  /**
   * Returns the total number of events currently stored.
   * @returns The number of events in the store.
   */
  count(): number {
    return this.events.size;
  }

  /**
   * Returns an array of all event IDs currently in the store.
   * @returns An array of event IDs.
   */
  list(): string[] {
    return Array.from(this.events.keys());
  }

  /**
   * Retrieves the current status of the event with the given ID.
   * @param transactionHash - Unique identifier for the event.
   * @returns The status of the event if it exists, otherwise null.
   */
  getStatus(transactionHash: string): EventStatus | null {
    this.getTransactionResult(transactionHash).then(console.log);
    const event = this.events.get(transactionHash);
    return event ? event.status : null;
  }

  private async getTransactionResult(transactionHash: string): Promise<{
    height: number;
    hasError: boolean;
    data: ResponseDataType;
  } | null> {
    const result = await this.networkClient.get(
      "/tx?hash=" + makeHexByBase64(transactionHash),
    );

    const height = Number(result.data?.result?.height || 0);
    if (!height) {
      return null;
    }

    const response = result.data?.result?.tx_result?.ResponseBase;
    const hasError = !!response?.Error;
    if (hasError) {
      return {
        height,
        hasError,
        data: [],
      };
    }

    const responseData = response?.Data;
    if (!responseData) {
      return {
        height,
        hasError,
        data: [],
      };
    }

    return {
      height,
      hasError,
      data: parseABCIValue(responseData),
    };
  }
}
