// API end point
export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001';

// Auth Module URL
export const auth_module = '/v1/auth';

// Workspace Module URL
export const workspace_module = '/v1/workspace';

// Subscription Module URL
export const subscription_module = '/v1/subscription';

//Members Module URL
export const members_module = '/v1/members';

//Platforms Module URL
export const platforms_module = '/v1/platforms';

//Slack connect
export const SLACK_CONNECT_ENDPOINT = import.meta.env.VITE_SLACK_CONNECT;

//Discord connect
export const DISCORD_CONNECT_ENDPOINT = import.meta.env.VITE_DISCORD_CONNECT;

//Reddit connect
export const REDDIT_CONNECT_ENDPOINT = import.meta.env.VITE_REDDIT_CONNECT;
