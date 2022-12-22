import { LoadLastEventRepositoryMock } from "../mocks/load-last-event-repository";
import { CheckLastEventStatus } from "../../src/services/check-last-event-status";

export type SutOutput = {
    sut: CheckLastEventStatus
    loadLastEventRepository: LoadLastEventRepositoryMock
}
