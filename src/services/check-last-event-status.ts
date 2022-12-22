import { ILoadLastEventRepository } from '../models/interfaces/load-last-event-repository';
import { EventStatus } from '../models/classes/event-status';

export class CheckLastEventStatus {
    constructor(private readonly loadLastEventRepository: ILoadLastEventRepository){}

    async perform(groupId: string): Promise<EventStatus> {
        const statusCheck = await this.loadLastEventRepository.loadLastEvent(groupId);

        return new EventStatus(statusCheck);
    }
}
