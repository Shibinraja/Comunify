import { GeneratorResponse } from '@/lib/api';
import { members_module } from '@/lib/config';
import { request } from '@/lib/request';
import { MembersCountResponse } from '../interface/members.interface';


//Members Module
export function* ActiveCountService(): GeneratorResponse<MembersCountResponse> {
    const { data } = yield request.get(`${members_module}/active-count`);
    return data;
}

export function* NewCountService(): GeneratorResponse<MembersCountResponse> {
    const { data } = yield request.get(`${members_module}/new-count`);
    return data;
}

export function* TotalCountService(): GeneratorResponse<MembersCountResponse> {
    const { data } = yield request.get(`${members_module}/total-count`);
    return data;
}
