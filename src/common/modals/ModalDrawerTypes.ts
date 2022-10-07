export type ModalDrawerTypes = {
  isOpen: boolean;
  isClose: () => void;
  onSubmit: () => void;
  contextText: string;
  loader:boolean;
  iconSrc:string
}