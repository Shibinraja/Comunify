import { MembersCountResponse } from 'modules/members/interface/members.interface';

export type VoidGenerator<T = unknown, TNext = unknown> = Generator<T, void, TNext>;

export interface InitialState {
    countData: Array<MembersCountResponse>;
}
