export class Queue<T = unknown> {
  private _arr: T[];

  constructor() {
    this._arr = [];
  }

  public get arr() {
    return this._arr;
  }

  enqueue(item: T) {
    this._arr.push(item);
  }

  dequeue() {
    return this._arr.shift();
  }
}
