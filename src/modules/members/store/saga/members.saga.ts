/* eslint-disable no-unused-vars */
import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
// import history from '@/lib/history';
import { AxiosError, SuccessResponse } from '@/lib/api';
import { showErrorToast } from 'common/toast/toastFunctions';
import loaderSlice from 'modules/authentication/store/slices/loader.slice';
import membersSlice from '../slice/members.slice';
import {
  MembersColumnsListUpdateService,
  MembersListExportService,
  MembersListService,
  MembersLocationFilterService,
  MembersOrganizationFilterService,
  TotalCountService,
  InactiveCountService,
  PlatformsDataService,
  MembersActivityGraphService,
  GetMembersActivityGraphDataPerPlatformService,
  MembersColumnsListService,
  MembersTagFilterService,
  GetMembersActivityDataInfiniteScrollSaga,
  GetMembersProfileCardService,
  MembersPlatformFilterService
} from 'modules/members/services/members.services';
import { PayloadAction } from '@reduxjs/toolkit';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
import {
  GetMembersListQueryParams,
  GetMembersLocationListQueryParams,
  GetMembersOrganizationListQueryParams,
  GetMembersTagListQueryParams,
  MembersColumnsParams,
  MembersCountResponse,
  MembersListResponse,
  MembersPlatformResponse,
  MembersProfileActivityGraphData,
  MembersTagResponse,
  PlatformsData,
  VerifyMembers,
  VerifyPlatform,
  workspaceId,
  ActivityDataResponse,
  ActivityInfiniteScroll,
  MemberProfileCard
} from 'modules/members/interface/members.interface';

// const forwardTo = (location: string) => {
//     history.push(location);
// };

function* membersTotalCount() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersCountResponse> = yield call(TotalCountService);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersTotalCountData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersNewCount() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersCountResponse> = yield call(TotalCountService);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersNewCountData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersActiveCount() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersCountResponse> = yield call(TotalCountService);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersActiveCountData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersInActiveCount() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersCountResponse> = yield call(InactiveCountService);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersInActiveCountData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersList(action: PayloadAction<Required<GetMembersListQueryParams>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersListResponse> = yield call(MembersListService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersListData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersActivityGraphSaga(action: PayloadAction<VerifyMembers>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());
    const res: SuccessResponse<MembersProfileActivityGraphData> = yield call(MembersActivityGraphService, action.payload);
    yield put(membersSlice.actions.setMembersActivityGraphData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
    if (error?.response?.data?.message) {
      showErrorToast('Failed to load graph data');
    }
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersPlatformFilter() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<Array<MembersPlatformResponse>> = yield call(MembersPlatformFilterService);
    if (res?.data) {
      yield put(membersSlice.actions.getmembersPlatformFilterData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersLocationFilter(action: PayloadAction<Partial<GetMembersLocationListQueryParams>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<Array<{ location: string }>> = yield call(MembersLocationFilterService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getmembersLocationFilterData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersTagFilter(action: PayloadAction<Partial<GetMembersTagListQueryParams>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<Array<MembersTagResponse>> = yield call(MembersTagFilterService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getmembersTagFilterData(res.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersOrganizationFilter(action: PayloadAction<Partial<GetMembersOrganizationListQueryParams>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<Array<{ organization: string }>> = yield call(MembersOrganizationFilterService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getmembersOrganizationFilterData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* getPlatformsDataSaga() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());
    const res: SuccessResponse<PlatformsData[]> = yield call(PlatformsDataService);
    yield put(membersSlice.actions.setPlatformsData({ platformsData: res?.data }));
  } catch (e) {
    // const error = e as AxiosError<unknown>;
    // throw error.response?.data?.message;
  }
}

function* membersColumnsList(action: PayloadAction<Omit<MembersColumnsParams, 'columnData'>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<Pick<MembersColumnsParams, 'columnData'>> = yield call(MembersColumnsListService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.customizedColumnData(res?.data?.columnData));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* getMembersActivityGraphDataPerPlatformSaga(action: PayloadAction<VerifyPlatform>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersProfileActivityGraphData> = yield call(GetMembersActivityGraphDataPerPlatformService, action.payload);
    yield put(membersSlice.actions.setMembersActivityGraphData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
    if (error?.response?.data?.message) {
      showErrorToast('Failed to load graph data');
    }
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersColumnsUpdateList(action: PayloadAction<MembersColumnsParams>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<Pick<MembersColumnsParams, 'columnData'>> = yield call(MembersColumnsListUpdateService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.membersColumnsList({ workspaceId: action.payload.workspaceId }));
      yield put(membersSlice.actions.customizedColumnData(res?.data?.columnData));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersListExport(action: PayloadAction<workspaceId>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<{type:string, data:Array<Buffer>}> = yield call(MembersListExportService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getmembersListExport(res?.data?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* getMembersActivityDataInfiniteScrollSaga(action: PayloadAction<ActivityInfiniteScroll>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());
    const res: SuccessResponse<ActivityDataResponse> = yield call(GetMembersActivityDataInfiniteScrollSaga, action.payload);
    yield put(membersSlice.actions.setMembersActivityData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* getMemberProfileCardData(action: PayloadAction<VerifyMembers>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());
    const res: SuccessResponse<MemberProfileCard[]> = yield call(GetMembersProfileCardService, action.payload);
    yield put(membersSlice.actions.setMemberProfileCardData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

export default function* membersSaga(): SagaIterator {
  yield takeEvery(membersSlice.actions.membersTotalCount.type, membersTotalCount);
  yield takeEvery(membersSlice.actions.membersNewCount.type, membersNewCount);
  yield takeEvery(membersSlice.actions.membersActiveCount.type, membersActiveCount);
  yield takeEvery(membersSlice.actions.membersInActiveCount.type, membersInActiveCount);
  yield takeEvery(membersSlice.actions.membersList.type, membersList);
  yield takeEvery(membersSlice.actions.getMembersActivityGraphData.type, membersActivityGraphSaga);
  yield takeEvery(membersSlice.actions.platformData.type, getPlatformsDataSaga);
  yield takeEvery(membersSlice.actions.getMembersActivityGraphDataPerPlatform.type, getMembersActivityGraphDataPerPlatformSaga);
  yield takeEvery(membersSlice.actions.membersTagFilter.type, membersTagFilter);
  yield takeEvery(membersSlice.actions.membersPlatformFilter.type, membersPlatformFilter);
  yield takeEvery(membersSlice.actions.membersLocationFilter.type, membersLocationFilter);
  yield takeEvery(membersSlice.actions.membersOrganizationFilter.type, membersOrganizationFilter);
  yield takeEvery(membersSlice.actions.membersColumnsList.type, membersColumnsList);
  yield takeEvery(membersSlice.actions.membersColumnsUpdateList.type, membersColumnsUpdateList);
  yield takeEvery(membersSlice.actions.membersListExport.type, membersListExport);
  yield takeEvery(membersSlice.actions.getMembersActivityDataInfiniteScroll.type, getMembersActivityDataInfiniteScrollSaga);
  yield takeEvery(membersSlice.actions.getMemberProfileCardData.type, getMemberProfileCardData);
}
