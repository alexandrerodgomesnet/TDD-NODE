import { Status } from "../enums/status";
import { IStatusCheck } from "../interfaces/status-check";

export class EventStatus {
    status?: Status;
    constructor(statusCheck: IStatusCheck | undefined){
        this.status = statusCheck?.verify()
    }
}
