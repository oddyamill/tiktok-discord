import { BotEnv } from '@oddyamill/discord-workers'

export interface Env extends BotEnv {
  DISCORD_TOKEN: string
  IMAGE_WORKER_ENDPOINT?: string
  IMAGE_WORKER_CLIENT_ID: string
  IMAGE_WORKER_CLIENT_SECRET: string
}
