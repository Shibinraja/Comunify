import { MergeMembersDataResult } from 'modules/members/interface/members.interface';
import { Dispatch, SetStateAction } from 'react';

/* eslint-disable no-unused-vars */
export enum MergeModalPropsEnum {
  MergeMember = 'Merge-Member',
  MergedMember = 'Merged-Member'
}

export type MergeModalProps = {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  type: MergeModalPropsEnum;
  mergedMemberList?: Array<MergeMembersDataResult>;
  checkedRadioId?: Record<string, unknown>;
  handleMergeMembers?: ()=> void;
};
