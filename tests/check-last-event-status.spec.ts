describe('CheckLastEventStatus', () => {
    it('should get last event data', async () => {
        const groupId: string = 'any_group_id';
        const loadLastEventRepository = new LoadLastEventRepositoryMock();
        const checkLastEventStatus = new CheckLastEventStatus(loadLastEventRepository);

        await checkLastEventStatus.perform(groupId);

        expect(loadLastEventRepository.groupId).toBe(groupId);
        expect(loadLastEventRepository.callsCount).toBe(1);
    });
});

interface ILoadLastEventRepository {
    loadLastEvent: (groupId: string) => Promise<void>;
}

class LoadLastEventRepositoryMock implements ILoadLastEventRepository {
    groupId?: string;
    callsCount = 0;

    async loadLastEvent(groupId: string): Promise<void> {
        this.groupId = groupId;
        this.callsCount++;
    }
}

class CheckLastEventStatus {
    constructor(private readonly loadLastEventRepository: ILoadLastEventRepository){}

    async perform(groupId: string): Promise<void> {
        this.loadLastEventRepository.loadLastEvent(groupId);
    }

}
