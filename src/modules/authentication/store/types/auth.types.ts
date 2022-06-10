export type VoidGenerator<T = unknown, TNext = unknown> = Generator<
  T,
  void,
  TNext
>;

export interface InitialState {
  isAuthenticated: boolean;
}
