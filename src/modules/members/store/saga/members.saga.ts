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
  PlatformsDataService,
  MembersActivityGraphService,
  GetMembersActivityGraphDataPerPlatformService,
  MembersColumnsListService,
  MembersTagFilterService,
  GetMembersActivityDataInfiniteScrollSaga,
  GetMembersProfileCardService,
  ActivityAnalyticsService,
  CountAnalyticsService
} from 'modules/members/services/members.services';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  GetMembersListQueryParams,
  GetMembersLocationListQueryParams,
  GetMembersOrganizationListQueryParams,
  GetMembersTagListQueryParams,
  MembersColumnsParams,
  MembersListResponse,
  PlatformResponse,
  MembersProfileActivityGraphData,
  MembersTagResponse,
  VerifyMembers,
  VerifyPlatform,
  workspaceId,
  ActivityDataResponse,
  ActivityInfiniteScroll,
  MemberProfileCard,
  MemberCountAnalyticsResponse,
  MemberActivityAnalyticsResponse
} from 'modules/members/interface/members.interface';

// const forwardTo = (location: string) => {
//     history.push(location);
// };

function* membersCountAnalytics(action: PayloadAction<workspaceId>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersCountAnalytics.type));

    const res: SuccessResponse<MemberCountAnalyticsResponse> = yield call(CountAnalyticsService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersCountAnalytics(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersCountAnalytics.type));
  }
}

function* membersActivityAnalytics(action: PayloadAction<workspaceId>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersActivityAnalytics.type));

    const res: SuccessResponse<MemberActivityAnalyticsResponse> = yield call(ActivityAnalyticsService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersActivityAnalytics(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersActivityAnalytics.type));
  }
}

function* membersList(action: PayloadAction<Required<GetMembersListQueryParams>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersList.type));

    const res: SuccessResponse<MembersListResponse> = yield call(MembersListService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersListData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersList.type));
  }
}

function* membersActivityGraphSaga(action: PayloadAction<VerifyMembers>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.getMembersActivityGraphData.type));
    const res: SuccessResponse<MembersProfileActivityGraphData> = yield call(MembersActivityGraphService, action.payload);
    yield put(membersSlice.actions.setMembersActivityGraphData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
    if (error?.response?.data?.message) {
      showErrorToast('Failed to load graph data');
    }
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.getMembersActivityGraphData.type));
  }
}

function* membersLocationFilter(action: PayloadAction<Partial<GetMembersLocationListQueryParams>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersLocationFilter.type));

    const res: SuccessResponse<Array<{ location: string }>> = yield call(MembersLocationFilterService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getmembersLocationFilterData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersLocationFilter.type));
  }
}

function* membersTagFilter(action: PayloadAction<Partial<GetMembersTagListQueryParams>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersTagFilter.type));

    const res: SuccessResponse<Array<MembersTagResponse>> = yield call(MembersTagFilterService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getmembersTagFilterData(res.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersTagFilter.type));
  }
}

function* membersOrganizationFilter(action: PayloadAction<Partial<GetMembersOrganizationListQueryParams>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersOrganizationFilter.type));

    const res: SuccessResponse<Array<{ organization: string }>> = yield call(MembersOrganizationFilterService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getmembersOrganizationFilterData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersOrganizationFilter.type));
  }
}

function* getPlatformsDataSaga() {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.platformData.type));

    const res: SuccessResponse<Array<PlatformResponse>> = yield call(PlatformsDataService);
    if (res?.data) {
      yield put(membersSlice.actions.getPlatformFilterData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.platformData.type));
  }
}

function* membersColumnsList(action: PayloadAction<Omit<MembersColumnsParams, 'columnData'>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersColumnsList.type));

    const res: SuccessResponse<Pick<MembersColumnsParams, 'columnData'>> = yield call(MembersColumnsListService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.customizedColumnData(res?.data?.columnData));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersColumnsList.type));
  }
}

function* getMembersActivityGraphDataPerPlatformSaga(action: PayloadAction<VerifyPlatform>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.getMembersActivityGraphDataPerPlatform.type));
    const res: SuccessResponse<MembersProfileActivityGraphData> = yield call(GetMembersActivityGraphDataPerPlatformService, action.payload);
    yield put(membersSlice.actions.setMembersActivityGraphData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
    if (error?.response?.data?.message) {
      showErrorToast('Failed to load graph data');
    }
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.getMembersActivityGraphDataPerPlatform.type));
  }
}

function* membersColumnsUpdateList(action: PayloadAction<MembersColumnsParams>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersColumnsUpdateList.type));

    const res: SuccessResponse<Pick<MembersColumnsParams, 'columnData'>> = yield call(MembersColumnsListUpdateService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.membersColumnsList({ workspaceId: action.payload.workspaceId }));
      yield put(membersSlice.actions.customizedColumnData(res?.data?.columnData));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersColumnsUpdateList.type));
  }
}

function* membersListExport(action: PayloadAction<workspaceId>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersListExport.type));

    const res: SuccessResponse<{ type: string; data: Array<Buffer> }> = yield call(MembersListExportService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getmembersListExport(res?.data?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersListExport.type));
  }
}

function* getMembersActivityDataInfiniteScrollSaga(action: PayloadAction<ActivityInfiniteScroll>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.getMembersActivityDataInfiniteScroll.type));
    const res: SuccessResponse<ActivityDataResponse> = yield call(GetMembersActivityDataInfiniteScrollSaga, action.payload);
    yield put(membersSlice.actions.setMembersActivityData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.getMembersActivityDataInfiniteScroll.type));
  }
}

function* getMemberProfileCardData(action: PayloadAction<VerifyMembers>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.getMemberProfileCardData.type));
    const res: SuccessResponse<MemberProfileCard[]> = yield call(GetMembersProfileCardService, action.payload);
    yield put(membersSlice.actions.setMemberProfileCardData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.getMemberProfileCardData.type));
  }
}

export default function* membersSaga(): SagaIterator {
  yield takeEvery(membersSlice.actions.membersCountAnalytics.type, membersCountAnalytics);
  yield takeEvery(membersSlice.actions.membersActivityAnalytics.type, membersActivityAnalytics);
  yield takeEvery(membersSlice.actions.membersList.type, membersList);
  yield takeEvery(membersSlice.actions.getMembersActivityGraphData.type, membersActivityGraphSaga);
  yield takeEvery(membersSlice.actions.platformData.type, getPlatformsDataSaga);
  yield takeEvery(membersSlice.actions.getMembersActivityGraphDataPerPlatform.type, getMembersActivityGraphDataPerPlatformSaga);
  yield takeEvery(membersSlice.actions.membersTagFilter.type, membersTagFilter);
  yield takeEvery(membersSlice.actions.membersLocationFilter.type, membersLocationFilter);
  yield takeEvery(membersSlice.actions.membersOrganizationFilter.type, membersOrganizationFilter);
  yield takeEvery(membersSlice.actions.membersColumnsList.type, membersColumnsList);
  yield takeEvery(membersSlice.actions.membersColumnsUpdateList.type, membersColumnsUpdateList);
  yield takeEvery(membersSlice.actions.membersListExport.type, membersListExport);
  yield takeEvery(membersSlice.actions.getMembersActivityDataInfiniteScroll.type, getMembersActivityDataInfiniteScrollSaga);
  yield takeEvery(membersSlice.actions.getMemberProfileCardData.type, getMemberProfileCardData);
}
