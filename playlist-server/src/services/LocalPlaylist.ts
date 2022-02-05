import { UpdateClient } from './../models/ActionTypes';
import { Container, Service } from 'typedi';
import AddResult from '../models/AddResult';
import IPlayList from '../interfaces/IPlayList';
import IQueue from '../interfaces/IQueue';
import WebSocketService from './WebSocketService';
import { ActionType } from '../enums/ActionType';

@Service()
export class LocalPlaylist implements IPlayList {
    constructor(private queue: IQueue, private _websocket: WebSocketService) {
        if (!queue) {
            queue = Container.get('Queue');
        }
        if (!this._websocket) {
            this._websocket = Container.get('WebSocketService');
        }
    }

    public async getCurrentStatus(clientId?: string): Promise<string[]> {
        const result: string[] = await this.queue.getItems().catch((error: Error) => {
            throw error;
        });
        return result;
    }

    public async addToPlayList(videoId: string, clientId: string): Promise<AddResult> {
        await this.queue.enqueue(videoId).catch((error: Error) => {
            throw error;
        });
        const result: AddResult = { requstedBy: clientId, addedItem: videoId };
        await this.updateClients(new UpdateClient(ActionType.itemAdded, videoId));
        return result;
    }

    public async removeFromPlaylist(videoId: string, clientId?: string): Promise<boolean> {
        await this.queue.removeItem(videoId).catch((error: Error) => {
            throw error;
        });
        await this.updateClients(new UpdateClient(ActionType.itemRemoved, videoId));
        return true;
    }

    public async reorderList(playlist: string[], clientId?: string): Promise<boolean> {
        await this.queue.replaceList(playlist).catch((error: Error) => {
            throw error;
        });
        await this.updateClients(new UpdateClient(ActionType.itemReordered, playlist));
        return true;
    }

    public async updateClients(update: UpdateClient): Promise<void> {
        this._websocket.wss.clients.forEach((c: any) => {
            c.send(JSON.stringify(update));
        });
    }
}
