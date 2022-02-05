import { Container } from 'typedi';
import { getEnvironmentVariable, toNumber } from '../globals/utils';
import IPlayList from '../interfaces/IPlayList';
import IQueue from '../interfaces/IQueue';
import { LocalPlaylist } from './LocalPlaylist';
import Queue from './Queue';
import WebSocketService from './WebSocketService';

export async function init(): Promise<void> {
    const ws: WebSocketService = new WebSocketService(toNumber(getEnvironmentVariable('WEBSOCKET_PORT', '6969')));
    Container.set('WebSocketService', WebSocketService);

    const queue: IQueue = new Queue();
    Container.set('Queue', queue);

    const localPlaylist: IPlayList = new LocalPlaylist(queue, ws);
    Container.set('LocalPlaylist', localPlaylist);
}
