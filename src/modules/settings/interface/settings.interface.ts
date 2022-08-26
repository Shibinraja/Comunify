export interface ModalState {
  slack: boolean;
  vanillaForums: boolean;
}

export type PlatformResponse = {
  id: string;
  name: string;
  status: string;
  errorMessage: string;
  platformLogoUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface PlatformIcons {
  slack: string | undefined;
  vanillaForums: string | undefined;
}
