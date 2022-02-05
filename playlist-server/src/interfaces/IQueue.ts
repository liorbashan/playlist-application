export default interface IQueue {
    enqueue(item: any): Promise<void>;
    dequeue(): Promise<void>;
    getItems(): Promise<any[]>;
    removeItem(item: any): Promise<void>;
    replaceList(items: any[]): Promise<void>;
}
