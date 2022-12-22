import { Status } from "../enums/status";

export interface IStatusCheck {
    verify: () => Status | undefined;
}
