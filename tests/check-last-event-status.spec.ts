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

        loadLastEventRepository.output = {
            endDate: new Date(new Date().getTime() + 1)
        };

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual('active');
    });

    it('should return status inReview when now is after event end time', async () => {
        const groupId: string = 'any_group_id';

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.output = {
            endDate: new Date(new Date().getTime() - 1)
        };

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual('inReview');
    });
});

interface ILoadLastEventRepository {
    loadLastEvent: (groupId: string) => Promise<{endDate: Date} | undefined>;
}

class LoadLastEventRepositoryMock implements ILoadLastEventRepository {
    groupId?: string;
    callsCount = 0;
    output?: {endDate: Date} | undefined;

    async loadLastEvent(groupId: string): Promise<{endDate: Date} | undefined> {
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
        return (event?.endDate as Date) > now ? {status: 'active'} : {status: 'inReview'};
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
