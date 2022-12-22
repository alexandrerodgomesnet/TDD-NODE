describe('CheckLastEventStatus', () => {
    it('should get last event data', async () => {
        const groupId: string = 'any_group_id';
        const loadLastEventRepository = new LoadLastEventRepositoryMock();

        const sut = new CheckLastEventStatus(loadLastEventRepository);

        await sut.perform(groupId);

        expect(loadLastEventRepository.groupId).toBe(groupId);
        expect(loadLastEventRepository.callsCount).toBe(1);
    });

    it('should return status done when group has no event', async () => {
        const groupId: string = 'any_group_id';
        const loadLastEventRepository = new LoadLastEventRepositoryMock();
        loadLastEventRepository.output = undefined;

        const sut = new CheckLastEventStatus(loadLastEventRepository);

        const status = await sut.perform(groupId);

        expect(status).toBe('done');
    });
});

interface ILoadLastEventRepository {
    loadLastEvent: (groupId: string) => Promise<undefined>;
}

class LoadLastEventRepositoryMock implements ILoadLastEventRepository {
    groupId?: string;
    callsCount = 0;
    output: undefined;

    async loadLastEvent(groupId: string): Promise<undefined> {
        this.groupId = groupId;
        this.callsCount++;
        return this.output;
    }
}

class CheckLastEventStatus {
    constructor(private readonly loadLastEventRepository: ILoadLastEventRepository){}

    async perform(groupId: string): Promise<string> {
        this.loadLastEventRepository.loadLastEvent(groupId);
        return 'done';
    }

}
