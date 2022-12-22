import { IStatusCheck } from "../interfaces/status-check";
import { DurationPeriod } from "../types/duration-period";
import { Status } from "../enums/status";

export class StatusCheckActive implements IStatusCheck {
    constructor(private event: DurationPeriod){}
    
    public verify = (): Status | undefined => {
        const now = new Date();
        if((this.event.endDate as Date) >= now)
            return Status.active;
        return undefined;
    };
}
