import { UpdateClient } from './../models/ActionTypes';
import AddResult from '../models/AddResult';

export default interface IPlayList {
    getCurrentStatus(clientId?: string): Promise<string[]>;
    addToPlayList(videoId: string, clientId?: string): Promise<AddResult>;
    removeFromPlaylist(videoId: string, clientId?: string): Promise<boolean>;
    reorderList(playlist: string[], clientId?: string): Promise<boolean>;
    updateClients(data: UpdateClient): Promise<void>;
}
