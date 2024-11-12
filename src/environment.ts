import { BotEnv } from '@oddyamill/discord-workers'

export interface Env extends BotEnv {
  DISCORD_APPLICATION_ID: string
  IMAGE_WORKER_ENDPOINT?: string
  IMAGE_WORKER_CLIENT_ID: string
  IMAGE_WORKER_CLIENT_SECRET: string
  ELISABETH_KEY: string
  CACHE: KVNamespace
}

let env: Env

export function setEnvironment(newEnv: Env): void {
  env = newEnv
}

export function environment<K extends keyof Env>(key: K): Env[K] {
  const value = env[key]

  if (value === undefined) {
    console.warn('undefined environment variable', key)
  }

  return value
}

export function environments(): Env {
  return env
}
