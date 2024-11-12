import { APIMessageComponentEmoji } from 'discord-api-types/v10'
import { EMOJI_CACHE_TTL } from '../constants'
import { environment } from '../environment'

const kv = (): KVNamespace => environment('CACHE')

export async function getComponentEmojiFromCache(
  authorId: string,
): Promise<APIMessageComponentEmoji | undefined> {
  return (await kv().get(authorId, 'json')) ?? undefined
}

export async function putComponentEmojiToCache(
  authorId: string,
  emoji: APIMessageComponentEmoji,
): Promise<void> {
  await kv().put(authorId, JSON.stringify(emoji), { expirationTtl: EMOJI_CACHE_TTL })
}

export async function deleteComponentEmojiFromCache(
  authorId: string,
): Promise<void> {
  await kv().delete(authorId)
}
