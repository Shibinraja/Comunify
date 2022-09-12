/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import { showErrorToast, showSuccessToast } from '../../../../common/toast/toastFunctions';
import { AxiosError, SuccessResponse } from '../../../../lib/api';
import loaderSlice from '../../../authentication/store/slices/loader.slice';
import {
  assignTagProps,
  ConnectedPlatforms,
  createTagProps,
  GetTagListQueryParams,
  PlatformResponse,
  TagResponse,
  unAssignTagProps,
  updateTagProps
} from '../../interface/settings.interface';
import {
  AssignTagDataService,
  CreateTagDataService,
  DeleteTagDataService,
  PlatformsDataService,
  TagDataService,
  UnAssignTagDataService,
  UpdateTagDataService,
  ConnectedPlatformsDataService
} from '../../services/settings.services';
import settingsSlice from '../slice/settings.slice';
import { workspaceId } from '../../../members/interface/members.interface';
import membersSlice from 'modules/members/store/slice/members.slice';
import activitiesSlice from 'modules/activities/store/slice/activities.slice';

const pageNumber = 1;
const limit = 10;

function* getPlatformsDataSaga(action: PayloadAction<workspaceId>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(settingsSlice.actions.platformData.type));
    const res: SuccessResponse<Array<PlatformResponse>> = yield call(PlatformsDataService, action.payload.workspaceId);
    if (res?.data) {
      yield put(settingsSlice.actions.getPlatformFilterData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(settingsSlice.actions.platformData.type));
  }
}
function* getConnectedPlatformsSaga(action: PayloadAction<workspaceId>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(settingsSlice.actions.connectedPlatforms.type));
    const res: SuccessResponse<Array<ConnectedPlatforms>> = yield call(ConnectedPlatformsDataService, action.payload.workspaceId);
    if (res?.data) {
      yield put(settingsSlice.actions.getConnectedPlatformsData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(settingsSlice.actions.connectedPlatforms.type));
  }
}

function* getTagDataSaga(action: PayloadAction<Partial<GetTagListQueryParams>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(settingsSlice.actions.tagFilterData.type));

    const res: SuccessResponse<TagResponse> = yield call(TagDataService, action.payload);
    if (res?.data) {
      yield put(settingsSlice.actions.getTagFilterData(res.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(settingsSlice.actions.tagFilterData.type));
  }
}

function* createTagDataSaga(action: PayloadAction<createTagProps>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(settingsSlice.actions.createTags.type));
    const res: SuccessResponse<TagResponse> = yield call(CreateTagDataService, action.payload);
    if (res?.data) {
      yield put(
        settingsSlice.actions.tagFilterData({
          settingsQuery: {
            page: pageNumber,
            limit,
            tags: {
              checkedTags: '',
              searchedTags: ''
            }
          },
          workspaceId: action.payload.workspaceId
        })
      );
    }
    showSuccessToast('Tag created successfully');
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(settingsSlice.actions.createTags.type));
  }
}

function* updateTagDataSaga(action: PayloadAction<updateTagProps>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(settingsSlice.actions.updateTags.type));

    const res: SuccessResponse<TagResponse> = yield call(UpdateTagDataService, action.payload);
    if (res?.data) {
      yield put(
        settingsSlice.actions.tagFilterData({
          settingsQuery: {
            page: pageNumber,
            limit,
            tags: {
              checkedTags: '',
              searchedTags: ''
            }
          },
          workspaceId: action.payload.workspaceId
        })
      );
      showSuccessToast('Tag updated successfully');
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(settingsSlice.actions.updateTags.type));
  }
}

function* deleteTagDataSaga(action: PayloadAction<Omit<updateTagProps, 'settingsQuery'>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(settingsSlice.actions.deleteTags.type));
    const res: SuccessResponse<TagResponse> = yield call(DeleteTagDataService, action.payload);
    if (res?.data) {
      yield put(settingsSlice.actions.resetValue(true));
      yield put(
        settingsSlice.actions.tagFilterData({
          settingsQuery: {
            page: pageNumber,
            limit,
            tags: {
              checkedTags: '',
              searchedTags: ''
            }
          },
          workspaceId: action.payload.workspaceId
        })
      );
    }
    showSuccessToast('Tag was successfully deleted');
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
    showErrorToast('Failed to delete tag');
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(settingsSlice.actions.deleteTags.type));
  }
}

function* assignTagDataSaga(action: PayloadAction<assignTagProps>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(settingsSlice.actions.assignTags.type));

    const res: SuccessResponse<{}> = yield call(AssignTagDataService, action.payload);
    if (res.message.toLocaleLowerCase() === 'tag assigned') {
      yield put(settingsSlice.actions.resetValue(true));
      yield put(
        membersSlice.actions.getMemberProfileCardData({
          workspaceId: action.payload.workspaceId,
          memberId: action.payload.memberId
        })
      );
      yield put(
        activitiesSlice.actions.getActiveStreamData({
          activeStreamQuery: {
            page: 1,
            limit: 10
          },
          workspaceId: action.payload.workspaceId
        })
      );
      showSuccessToast('Tag Assigned');
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
    yield put(settingsSlice.actions.resetValue(true));
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(settingsSlice.actions.assignTags.type));
  }
}

function* unAssignTagDataSaga(action: PayloadAction<unAssignTagProps>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(settingsSlice.actions.unAssignTags.type));

    const res: SuccessResponse<{}> = yield call(UnAssignTagDataService, action.payload);
    if (res.message.toLocaleLowerCase() === 'tag unassigned') {
      yield put(
        membersSlice.actions.getMemberProfileCardData({
          workspaceId: action.payload.workspaceId,
          memberId: action.payload.memberId
        })
      );
      yield put(
        membersSlice.actions.membersList({
          workspaceId: action.payload.workspaceId,
          membersQuery: {
            page: 1,
            limit: 10
          }
        })
      );
      showSuccessToast('Tag Unassigned');

    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
    yield put(settingsSlice.actions.resetValue(true));
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(settingsSlice.actions.unAssignTags.type));
  }
}

export default function* settingsSaga(): SagaIterator {
  yield takeEvery(settingsSlice.actions.platformData.type, getPlatformsDataSaga);
  yield takeEvery(settingsSlice.actions.connectedPlatforms.type, getConnectedPlatformsSaga);
  yield takeEvery(settingsSlice.actions.tagFilterData.type, getTagDataSaga);
  yield takeEvery(settingsSlice.actions.createTags.type, createTagDataSaga);
  yield takeEvery(settingsSlice.actions.updateTags.type, updateTagDataSaga);
  yield takeEvery(settingsSlice.actions.deleteTags.type, deleteTagDataSaga);
  yield takeEvery(settingsSlice.actions.assignTags.type, assignTagDataSaga);
  yield takeEvery(settingsSlice.actions.unAssignTags.type, unAssignTagDataSaga);
}
