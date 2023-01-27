/* eslint-disable no-unused-vars */
export type IntegrationModalDrawerTypes = {
  isOpen: boolean;
  isClose: () => void;
  contextText: string;
  iconSrc: string;
};

export enum PlatformsEnumType {
  SLACK = 'slack',
  VANILLA = 'vanilla',
  DISCORD = 'discord',
  REDDIT = 'reddit',
  GITHUB = 'github',
  DISCOURSE = 'discourse',
  TWITTER = 'twitter',
  SALESFORCE = 'salesforce'
}
