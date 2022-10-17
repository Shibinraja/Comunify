import { SubscriptionPackages } from '../../interface/auth.interface';

export type VoidGenerator<T = unknown, TNext = unknown> = Generator<T, void, TNext>;

export interface InitialState {
  isAuthenticated: boolean;
  subscriptionData: SubscriptionPackages[];
  workspaceData: Array<[]>;
  clearFormikValue: boolean;
  userEmail: string;
  workspaceId:string
}
