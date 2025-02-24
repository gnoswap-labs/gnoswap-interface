import { EventCallback } from "src/types/events.types";

class EventBus {
  private events: { [key: string]: EventCallback[] } = {};

  on(eventName: string, callback: EventCallback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName: string, callback: EventCallback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(eventName: string, data?: any) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach(callback => callback(data));
  }
}

export const eventBus = new EventBus();
