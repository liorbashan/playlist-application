import { ActionType } from '../enums/ActionType';

export class UpdateClient {
    public actionType: ActionType;
    public data: any;

    constructor(at: ActionType, d: any) {
        this.actionType = at;
        this.data = d;
    }
}
