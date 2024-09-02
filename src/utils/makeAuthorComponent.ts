import { APIButtonComponentWithURL } from 'discord-api-types/v10'
import { makeComponent } from './makeComponent'
import { Env } from '../env'
import { Interaction } from '../interaction'
import { createApplicationEmoji } from '@oddyamill/discord-workers'
import { arrayBufferToBase64 } from './arrayBufferToBase64'
import { getComponentEmojiFromCache, putComponentEmojiToCache } from './emojiCache'
import { TIKTOK_USER_ENDPOINT } from '../constants'

export const makeAuthorComponent = async (
  label: string,
  authorId: string,
  authorUsername: string,
  authorAvatar: string,
  interaction: Interaction,
  env: Env,
  ctx: ExecutionContext,
): Promise<APIButtonComponentWithURL> => {
  const component = makeComponent(
    label,
    TIKTOK_USER_ENDPOINT + authorUsername,
    await getComponentEmojiFromCache(env, authorId)
  )

  if (component.emoji !== undefined) {
    return component
  }

  const url =
    env.IMAGE_WORKER_ENDPOINT !== undefined
      ? env.IMAGE_WORKER_ENDPOINT + '/circle?url=' + encodeURIComponent(authorAvatar)
      : authorAvatar

  const image = await fetch(url, {
    headers: {
      'Cf-Access-Client-Id': env.IMAGE_WORKER_CLIENT_ID,
      'Cf-Access-Client-Secret': env.IMAGE_WORKER_CLIENT_SECRET,
    },
  })

  if (!image.ok) {
    return component
  }

  try {
    const emoji = await createApplicationEmoji(
      env,
      interaction.application_id,
      authorId,
      'data:image/png;base64,' + arrayBufferToBase64(await image.arrayBuffer())
    )

    component.emoji = { id: emoji.id!, name: emoji.name! }
    ctx.waitUntil(putComponentEmojiToCache(env, authorId, component.emoji))
  } catch (error) {
    console.error(error)
  }

  return component
}
