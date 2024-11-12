import { APIButtonComponentWithURL } from 'discord-api-types/v10'
import { makeComponent } from './makeComponent'
import { environment, environments } from '../environment'
import { Interaction } from '../interaction'
import { createApplicationEmoji } from '@oddyamill/discord-workers'
import { arrayBufferToBase64 } from './arrayBufferToBase64'
import {
  getComponentEmojiFromCache,
  putComponentEmojiToCache,
} from './emojiCache'
import { TIKTOK_USER_ENDPOINT } from '../constants'
import { Author } from '../tiktok'

export async function makeAuthorComponent(
  author: Author,
  interaction: Interaction,
): Promise<APIButtonComponentWithURL> {
  const { id, nickname, uniqueId, avatarThumb } = author

  const component = makeComponent(
    nickname,
    TIKTOK_USER_ENDPOINT + uniqueId,
    await getComponentEmojiFromCache(id),
  )

  if (component.emoji !== undefined) {
    return component
  }

  const imageWorkerEndpoint = environment('IMAGE_WORKER_ENDPOINT')
  const url = imageWorkerEndpoint !== undefined
    ? imageWorkerEndpoint + '/circle?url=' + encodeURIComponent(avatarThumb)
    : avatarThumb

  const image = await fetch(url, {
    headers: {
      'Cf-Access-Client-Id': environment('IMAGE_WORKER_CLIENT_ID'),
      'Cf-Access-Client-Secret': environment('IMAGE_WORKER_CLIENT_SECRET'),
    },
  })

  if (!image.ok) {
    return component
  }

  try {
    const emoji = await createApplicationEmoji(
      environments(),
      interaction.application_id,
      id,
      'data:image/png;base64,' + arrayBufferToBase64(await image.arrayBuffer()),
    )

    component.emoji = { id: emoji.id!, name: emoji.name! }
    await putComponentEmojiToCache(id, component.emoji)
  } catch (error) {
    console.error('makeAuthorComponent error', error)
  }

  return component
}
