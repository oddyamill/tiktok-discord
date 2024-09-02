import { APIMessageComponentEmoji } from 'discord-api-types/v10'
import { EMOJI_CACHE_TTL } from '../constants'
import { Env } from '../env'

export const getComponentEmojiFromCache = async (
  env: Env,
  authorId: string
): Promise<APIMessageComponentEmoji | undefined> => {
  return (await env.CACHE.get(authorId, 'json')) ?? undefined
}

export const putComponentEmojiToCache = async (
  env: Env,
  authorId: string,
  emoji: APIMessageComponentEmoji
): Promise<void> => {
  await env.CACHE.put(authorId, JSON.stringify(emoji), { expirationTtl: EMOJI_CACHE_TTL })
}

export const deleteComponentEmojiFromCache = async (
  env: Env,
  authorId: string
): Promise<void> => {
  await env.CACHE.delete(authorId)
}
