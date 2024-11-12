import {
  deleteApplicationEmoji,
  getApplicationEmojis,
} from '@oddyamill/discord-workers'
import { deleteComponentEmojiFromCache } from '../utils'
import { environment, environments } from '../environment'

export async function runSchedule(ctx: ExecutionContext): Promise<void> {
  const env = environments(),
    applicationId = environment('DISCORD_APPLICATION_ID')

  const { items: emojis } = await getApplicationEmojis(env, applicationId)
  if (emojis.length === 0) {
    return
  }

  const promises = []

  for (const emoji of emojis) {
    promises.push(
      deleteApplicationEmoji(env, applicationId, emoji.id!),
      deleteComponentEmojiFromCache(emoji.name!),
    )
  }

  ctx.waitUntil(Promise.allSettled(promises))
}
