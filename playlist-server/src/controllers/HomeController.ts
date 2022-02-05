import { JsonController, Post, Body, Get, Req, Res, InternalServerError, QueryParam, BadRequestError } from 'routing-controllers';
import Container, { Service } from 'typedi';
import AddResult from '../models/AddResult';
import ItemRequest from '../models/ItemRequest';
import IPlayList from '../interfaces/IPlayList';
import SetListRequest from '../models/SetListRequest';

@Service()
@JsonController('/api')
export class HomeController {
    constructor(private _playlist: IPlayList) {
        if (!_playlist) {
            this._playlist = Container.get('LocalPlaylist');
        }
    }

    @Get('/get-playlist')
    public async getPlaylistCurrentStatus(@QueryParam('clientId') clientId: string, @Res() response: any): Promise<string[]> {
        const result: string[] = await this._playlist.getCurrentStatus(clientId).catch((error: Error) => {
            response.status(500);
            throw new InternalServerError(error.message);
        });
        response.status(200);
        return result;
    }

    @Post('/add-item')
    public async addToPlaylist(@Body() payload: ItemRequest, @Res() response: any): Promise<AddResult> {
        if (payload.songId === '' || payload.songId === null) {
            throw new BadRequestError('songId is missing');
        }
        if (payload.songId.includes('http://') || payload.songId.includes('https://')) {
            throw new BadRequestError('songId must be a video ID, URL are not supported.');
        }
        const result: AddResult = await this._playlist.addToPlayList(payload.songId, payload.clientId).catch((error: Error) => {
            response.status(500);
            throw new InternalServerError(error.message);
        });
        response.status(200);
        return result;
    }

    @Post('/remove-item')
    public async removeFromPlaylist(@Body() payload: ItemRequest, @Res() response: any): Promise<boolean> {
        const result: boolean = await this._playlist.removeFromPlaylist(payload.songId, payload.clientId).catch((error: Error) => {
            response.status(500);
            throw new InternalServerError(error.message);
        });
        response.status(200);
        return result;
    }

    @Post('/reorder-items')
    public async setPlaylist(@Body() payload: SetListRequest, @Res() response: any): Promise<boolean> {
        const result: boolean = await this._playlist.reorderList(payload.list, payload.clientId).catch((error: Error) => {
            response.status(500);
            throw new InternalServerError(error.message);
        });
        response.status(200);
        return result;
    }

    @Get('/health-check')
    public async get(@Req() request: any, @Res() response: any): Promise<string> {
        response.status(200);
        return 'OK';
    }
}
