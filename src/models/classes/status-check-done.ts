import { IStatusCheck } from "../interfaces/status-check";
import { DurationPeriod } from "../types/duration-period";
import { Status } from "../enums/status";

export class StatusCheckDone implements IStatusCheck {
    constructor(private event?: DurationPeriod){}
    public verify = (): Status | undefined => {
        if(this.event === undefined)
            return Status.done;
    };
}
