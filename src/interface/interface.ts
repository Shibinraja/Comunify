/* eslint-disable no-unused-vars */

import { SubscriptionPackages } from 'modules/authentication/interface/auth.interface';
import { type } from 'os';
import { MutableRefObject } from 'react';

export interface RoutesArray {
  index?: boolean;
  element?: JSX.Element;
  path?: string;
  children?: RoutesArray[];
}

export interface Props {
  name: string;
  label?: string;
  type?: string;
  errors?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string | string[];
  id: string;
  ref?: MutableRefObject<any>;
  helperText?: any;
  handleSubmit?: () => void;
  username?: string;
  className?: string;
  maxLength?: number;
  onBlur?: (e: React.FocusEvent<any, Element> | undefined) => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export type SubscriptionProps = {
  subscriptionData: SubscriptionPackages;
};

export interface ActiveState {
  dashboard?: boolean;
  members?: boolean;
  activity?: boolean;
  reports?: boolean;
  settings?: boolean;
}

export interface PlatformConnectResponse {
  id: string;
  workspacePlatformId: string;
  type: string;
  domain: string;
  channelId: string | null;
  authToken: string;
  clientSecret: null;
  clientId: null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscordChannel {
  id: string;
  last_message_id: string;
  type: number;
  name: string;
  position: number;
  flags: number;
  parent_id: string;
  topic: null | string;
  guild_id: string;
  permission_overwrites: string[];
  rate_limit_per_user: number;
  nsfw: boolean;
}

export interface DiscourseConnectResponse extends PlatformConnectResponse {
  platformAuthSettingsId: string | null;
  refreshToken: string | null;
  guildId: string | null;
}

export interface DiscordConnectResponse extends PlatformConnectResponse {
  platformAuthSettingsId: string;
  guildName: string;
  refreshToken: string;
  guildId: string;
  channels: DiscordChannel[];
}

export type RedditCommunities = {
  communityName: string;
  communityId: string;
};
export type SalesforceCommunities = {
  communityName: string;
  communityId: string;
  communityUrl: string;
};

export interface SampleConnectResponseData<T> extends PlatformConnectResponse {
  workspacePlatformAuthSettingsId: string;
  refreshToken: string;
  guildId: null;
  communities: T[];
}

export interface RedditConnectResponseData extends SampleConnectResponseData<RedditCommunities> {
  communities: RedditCommunities[];
}

export interface SalesforceConnectResponse extends SampleConnectResponseData<SalesforceCommunities> {
  communities: SalesforceCommunities[];
}

export interface GithubRepositories {
  repoName: string;
  repoId: string;
}

export interface GithubConnectResponseData extends PlatformConnectResponse {
  platformAuthSettingsId: string;
  guildId: string;
  refreshToken: string;
  filteredRepository: GithubRepositories[];
}

export type PaginationResponse<T> = {
  data: T[];
  totalPages: number;
  previousPage: number;
  nextPage: number;
};
