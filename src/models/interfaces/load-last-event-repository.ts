import { IStatusCheck } from "./status-check";

export interface ILoadLastEventRepository {
    loadLastEvent: (groupId: string) => Promise<IStatusCheck | undefined>;
}
