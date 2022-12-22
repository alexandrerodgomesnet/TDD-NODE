import { set, reset } from 'mockdate';
import { Status } from '../src/models/enums/status';
import { CheckLastEventStatus } from '../src/services/check-last-event-status';
import { LoadLastEventRepositoryMock } from './mocks/load-last-event-repository';
import { SutOutput } from './types/sut-output';

const makeSut = (): SutOutput => {
    const loadLastEventRepository = new LoadLastEventRepositoryMock();
    const sut = new CheckLastEventStatus(loadLastEventRepository);
    return {
        sut,
        loadLastEventRepository
    };
}

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

        loadLastEventRepository.setCheckStatusDone(undefined);

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toBe(Status.done);
    });

    it('should return status active when now is before event end time', async () => {
        const groupId: string = 'any_group_id';

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.setCheckStatusActive({
            endDate: new Date(new Date().getTime() + 1),
            reviewDurationInHours: 1
        });

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual(Status.active);
    });

    it('should return status active when now is equal to event end time', async () => {
        const groupId: string = 'any_group_id';

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.setCheckStatusActive({
            endDate: new Date(),
            reviewDurationInHours: 1
        });

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual(Status.active);
    });

    it('should return status inReview when now is after event end time', async () => {
        const groupId: string = 'any_group_id';

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.StatusCheckInReviewOrDone({
            endDate: new Date(new Date().getTime() - 1),
            reviewDurationInHours: 1
        })

        const eventStatus = await sut.perform(groupId);
        expect(eventStatus.status).toEqual(Status.inReview);
    });

    it('should return status inReview when now is before review time', async () => {
        const groupId: string = 'any_group_id';
        const reviewDurationInHours = 1;
        const reviewDurationInMS = (reviewDurationInHours * 60 * 60 * 1000);

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.StatusCheckInReviewOrDone({
            endDate: new Date(new Date().getTime() - reviewDurationInMS + 1),
            reviewDurationInHours
        });

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual(Status.inReview);
    });

    it('should return status inReview when now equal to review time', async () => {
        const groupId: string = 'any_group_id';
        const reviewDurationInHours = 1;
        const reviewDurationInMS = (reviewDurationInHours * 60 * 60 * 1000);

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.StatusCheckInReviewOrDone({
            endDate: new Date(new Date().getTime() - reviewDurationInMS),
            reviewDurationInHours
        });

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual(Status.inReview);
    });

    it('should return status done when now is after review time', async () => {
        const groupId: string = 'any_group_id';
        const reviewDurationInHours = 1;
        const reviewDurationInMS = (reviewDurationInHours * 60 * 60 * 1000);

        const { sut, loadLastEventRepository } = makeSut();

        loadLastEventRepository.StatusCheckInReviewOrDone({
            endDate: new Date(new Date().getTime() - reviewDurationInMS - 1),
            reviewDurationInHours
        });

        const eventStatus = await sut.perform(groupId);

        expect(eventStatus.status).toEqual(Status.done);
    });
});
