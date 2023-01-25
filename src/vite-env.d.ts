/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_SLACK_CONNECT: string;
  readonly VITE_DISCORD_CONNECT: string;
  readonly VITE_GITHUB_CONNECT: string;
  readonly VITE_TWITTER_CONNECT: string;
  readonly VITE_SALESFORCE_CONNECT: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_OS_HOSTNAME: string;
  readonly VITE_CENTRIFUGO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
