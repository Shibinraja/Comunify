export type VoidGenerator<T = unknown, TNext = unknown> = Generator<T, void, TNext>;

export interface InitialState {
    isAuthenticated: boolean;
    subscriptionData?: {
        id: string;
        name: string;
        viewName: string;
        cost: number;
        type: string;
        status: string;
        subscriptionPeriod: number;
        createdDate: Date;
        updatedDate: Date;
        updatedAt: Date;
    };
}
