// API end point
export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001';

// Auth Module URL
export const auth_module = '/v1/auth';

// Workspace Module URL
export const workspace_module = '/v1/workspace';

// Subscription Module URL
export const subscription_module = '/v1/subscription';

// Members Module URL
export const members_module = '/v1/members';

// Users Module URL
export const users_module = '/v1/users';

// Platforms Module URL
export const platforms_module = '/v1/platforms';

// Stripe publishable key
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Slack connect
export const SLACK_CONNECT_ENDPOINT = import.meta.env.VITE_SLACK_CONNECT;

// Discord connect
export const DISCORD_CONNECT_ENDPOINT = import.meta.env.VITE_DISCORD_CONNECT;

// Reddit connect
export const REDDIT_CONNECT_ENDPOINT = import.meta.env.VITE_REDDIT_CONNECT;

// Github connect
export const GITHUB_CONNECT_ENDPOINT = import.meta.env.VITE_GITHUB_CONNECT;

// Twitter connect
export const TWITTER_CONNECT_ENDPOINT = import.meta.env.VITE_TWITTER_CONNECT;

// Application Env's
export const VITE_APP_ENV = import.meta.env.VITE_APP_ENV;
export const VITE_OS_HOSTNAME = import.meta.env.VITE_OS_HOSTNAME;

// Centrifugo connect url
export const VITE_CENTRIFUGO_URL = import.meta.env.VITE_CENTRIFUGO_URL;
