
import { DurationPeriod } from "../../src/models/types/duration-period";
import { ILoadLastEventRepository } from "../../src/models/interfaces/load-last-event-repository";
import { IStatusCheck } from "../../src/models/interfaces/status-check";
import { StatusCheckInReviewOrDone } from "../../src/models/classes/status-check-in-review-or-done";
import { StatusCheckActive } from '../../src/models/classes/status-check-active';
import { StatusCheckDone } from '../../src/models/classes/status-check-done';

export class LoadLastEventRepositoryMock implements ILoadLastEventRepository {
    groupId?: string;
    callsCount = 0;
    output?: IStatusCheck | undefined;

    setCheckStatusDone(event?: DurationPeriod): void {
        this.output = new StatusCheckDone(event);
    }

    setCheckStatusActive(event: DurationPeriod) {
        this.output = new StatusCheckActive(event);
    }

    StatusCheckInReviewOrDone(event: DurationPeriod) {
        this.output = new StatusCheckInReviewOrDone(event);
    }

    setEndDateAfterNow(event: DurationPeriod): void {
        this.output = new StatusCheckActive(event);
    }

    setEndDateEqualToNow(event: DurationPeriod): void {

        this.output = new StatusCheckActive(event);
    }

    async loadLastEvent(groupId: string): Promise<IStatusCheck | undefined> {
        this.groupId = groupId;
        this.callsCount++;
        return this.output;
    }
}
