import { StringMap } from './../interfaces/StringMap';
import IQueue from '../interfaces/IQueue';
import { Service } from 'typedi';

@Service()
export default class Queue implements IQueue {
    private items: string[];
    private list: StringMap;

    constructor(...params: string[]) {
        this.items = [...params];
        this.list = {};
        // this.list['playlist-1'] = ['vidId1', 'vidId2', 'vidId3'];

        // TODO: implement add, remove and reorder based on the key-value list.
        // key is playlist ID, and value is the items array.
        // implement a "create playlist", expose list of playlists to client to choose from.
    }

    public async enqueue(item: string): Promise<void> {
        try {
            this.items.push(item);
        } catch (error) {
            throw error;
        }
    }

    public async dequeue(): Promise<void> {
        this.items.shift();
    }

    public async getItems(): Promise<string[]> {
        try {
            return this.items;
        } catch (error) {
            throw error;
        }
    }

    public async removeItem(item: any): Promise<void> {
        const filterResult = this.items.filter((x) => {
            return x !== item;
        });
        this.items = filterResult;
    }

    public async replaceList(items: any[]): Promise<void> {
        try {
            this.items = items;
        } catch (error) {
            throw error;
        }
    }
}
