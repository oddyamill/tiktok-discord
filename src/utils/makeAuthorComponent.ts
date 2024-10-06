import { APIButtonComponentWithURL } from 'discord-api-types/v10'
import { makeComponent } from './makeComponent'
import { Env } from '../env'
import { Interaction } from '../interaction'
import { createApplicationEmoji } from '@oddyamill/discord-workers'
import { arrayBufferToBase64 } from './arrayBufferToBase64'
import { getComponentEmojiFromCache, putComponentEmojiToCache } from './emojiCache'
import { TIKTOK_USER_ENDPOINT } from '../constants'
import { Author } from '../tiktok'

export const makeAuthorComponent = async (
  author: Author,
  interaction: Interaction,
  env: Env,
  ctx: ExecutionContext,
): Promise<APIButtonComponentWithURL> => {
  const { id, nickname, uniqueId, avatarThumb } = author

  const component = makeComponent(
    nickname,
    TIKTOK_USER_ENDPOINT + uniqueId,
    await getComponentEmojiFromCache(env, id)
  )

  if (component.emoji !== undefined) {
    return component
  }

  const url =
    env.IMAGE_WORKER_ENDPOINT !== undefined
      ? env.IMAGE_WORKER_ENDPOINT + '/circle?url=' + encodeURIComponent(avatarThumb)
      : avatarThumb

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
      id,
      'data:image/png;base64,' + arrayBufferToBase64(await image.arrayBuffer())
    )

    component.emoji = { id: emoji.id!, name: emoji.name! }
    ctx.waitUntil(putComponentEmojiToCache(env, id, component.emoji))
  } catch (error) {
    console.error(error)
  }

  return component
}
