/* eslint-disable no-unused-vars */
import { SubscriptionPackages } from 'modules/authentication/interface/auth.interface';

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
  value?: string;
  id: string;
  helperText?: any;
  handleSubmit?: any;
  username?: string;
  className?: string;
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
  workspacePlatformSettingsId: string;
  type?: string;
  domain: string;
  channelId: string | null;
  auth_token: string;
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

export interface DiscordConnectResponse extends PlatformConnectResponse {
  platformAuthSettingsId: string;
  guildName: string;
  refreshToken: string;
  guildId: string;
  channels: DiscordChannel[];
}
