export type MergeModalProps = {
  isOpen: {
    UnMergeModalOpen: boolean;
    ChangePrimaryMember: boolean;
  };
  isClose: () => void;
  onSubmit: () => void;
};
