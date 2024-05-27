export declare class Queue<T = unknown> {
    private _arr;
    constructor();
    get arr(): T[];
    enqueue(item: T): void;
    dequeue(): T | undefined;
}
