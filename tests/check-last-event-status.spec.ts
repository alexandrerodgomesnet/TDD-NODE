import {set, reset} from 'mockdate';

describe('CheckLastEventStatus', () => {

    beforeAll(() =>{
        set(new Date())
    })

    afterAll(() =>{
        reset()
    })

    it('should get last event data', async () => {
        const groupId: string = 'any_group_id';
        const { sut, loadLastEventRepository } = makeSut();

        await sut.perform(groupId);

        expect(loadLastEventRepository.groupId).toBe(groupId);
        expect(loadLastEventRepository.callsCount).toBe(1);
    });

    it('should return status done when group has no event', async () => {
        const groupId: string = 'any_group_id';

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.output = undefined;

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toBe('done');
    });

    it('should return status active when now is before event end time', async () => {
        const groupId: string = 'any_group_id';

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.setEndDateAfterNow();

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual('active');
    });

    it('should return status active when now is equal to event end time', async () => {
        const groupId: string = 'any_group_id';

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.setEndDateEqualToNow();

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual('active');
    });

    it('should return status inReview when now is after event end time', async () => {
        const groupId: string = 'any_group_id';

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.setEndDateBeforeNow();

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual('inReview');
    });

    it('should return status inReview when now is before review time', async () => {
        const groupId: string = 'any_group_id';
        const reviewDurationInHours = 1;
        const reviewDurationInMS = (reviewDurationInHours * 60 * 60 * 1000);

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.output ={
            endDate: new Date(new Date().getTime() - reviewDurationInMS + 1),
            reviewDurationInHours
        }

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual('inReview');
    });

    it('should return status inReview when now equal to review time', async () => {
        const groupId: string = 'any_group_id';
        const reviewDurationInHours = 1;
        const reviewDurationInMS = (reviewDurationInHours * 60 * 60 * 1000);

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.output ={
            endDate: new Date(new Date().getTime() - reviewDurationInMS),
            reviewDurationInHours
        }

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual('inReview');
    });
});

interface ILoadLastEventRepository {
    loadLastEvent: (groupId: string) => Promise<{endDate: Date, reviewDurationInHours: number} | undefined>;
}

class LoadLastEventRepositoryMock implements ILoadLastEventRepository {
    groupId?: string;
    callsCount = 0;
    output?: {endDate: Date, reviewDurationInHours: number} | undefined;

    setEndDateBeforeNow(): void {
        this.output = {
            endDate: new Date(new Date().getTime() - 1),
            reviewDurationInHours: 1
        }
    }

    setEndDateAfterNow(): void {
        this.output = {
            endDate: new Date(new Date().getTime() + 1),
            reviewDurationInHours: 1
        }
    }

    setEndDateEqualToNow(): void {
        this.output = {
            endDate: new Date(),
            reviewDurationInHours: 1
        }
    }

    async loadLastEvent(groupId: string): Promise<{endDate: Date, reviewDurationInHours: number} | undefined> {
        this.groupId = groupId;
        this.callsCount++;
        return this.output;
    }
}

type EventStatus = { status: string }

class CheckLastEventStatus {
    constructor(private readonly loadLastEventRepository: ILoadLastEventRepository){}

    async perform(groupId: string): Promise<EventStatus> {
        const event = await this.loadLastEventRepository.loadLastEvent(groupId);

        if(event === undefined) return {status: 'done'};

        const now = new Date();
        return (event?.endDate as Date) >= now ? {status: 'active'} : {status: 'inReview'};
    }

}

type SutOutput = {
    sut: CheckLastEventStatus
    loadLastEventRepository: LoadLastEventRepositoryMock
}

const makeSut = (): SutOutput => {
    const loadLastEventRepository = new LoadLastEventRepositoryMock();
    const sut = new CheckLastEventStatus(loadLastEventRepository);
    return {
        sut,
        loadLastEventRepository
    };
}
