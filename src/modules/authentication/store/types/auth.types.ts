import { workspaceResponse } from 'modules/authentication/interface/authentication.interface';

export type VoidGenerator<T = unknown, TNext = unknown> = Generator<
  T,
  void,
  TNext
>;

export interface InitialState {
  isAuthenticated: boolean;
  workspaceData: Array<[]>;
  clearFormikValue: boolean
}
