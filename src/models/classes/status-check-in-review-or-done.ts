import { IStatusCheck } from "../interfaces/status-check";
import { DurationPeriod } from "../types/duration-period";
import { Status } from "../enums/status";

export class StatusCheckInReviewOrDone implements IStatusCheck {
    constructor(private event: DurationPeriod){}
    public verify = (): Status | undefined => {
        const now = new Date();

        if(this.event.reviewDurationInHours && this.event.endDate){
            const reviewDurationInMS = (this.event.reviewDurationInHours * 60 * 60 * 1000);
            const reviewDate = new Date(this.event.endDate.getTime() + reviewDurationInMS);

            if(reviewDate >= now)
                return Status.inReview;
        }

        return Status.done;
    };
}
