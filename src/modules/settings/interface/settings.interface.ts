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
  isConnected: boolean;
};

export interface ConnectedPlatforms {
  id: string;
  workspaceId: string;
  platformId: string;
  name: string;
  status: string;
  lastFetched: string;
  createdAt: Date;
  updatedAt: Date;
  platform: {
    name: string;
    platformLogoUrl: string;
  };
}

export interface PlatformIcons {
  slack: string | undefined;
  vanillaForums: string | undefined;
}
export interface SlackConnectData {
  code: string | null;
  workspaceId: string;
}

export interface VanillaForumsConnectData {
  vanillaBaseUrl: string;
  vanillaAccessToken: string;
  workspaceId: string;
}
