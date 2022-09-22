export type MergeModalProps = {
  isOpen: {
    UnMergeModalOpen: boolean;
    ChangePrimaryMember?: boolean;
    confirmMerge?:boolean
  };
  isClose: () => void;
  onSubmit: () => void;
  contextText: string
};
