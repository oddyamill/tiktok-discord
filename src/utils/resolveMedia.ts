import { ItemStruct } from '../tiktok'
import { IMAGE_WORKER_CACHE_TTL, TIKTOK_HEADERS } from '../constants'
import { resolveCookie } from './resolveCookie'
import { environment } from '../environment'
import { Interaction } from '../interaction'
import { resolveMaxFileSize } from './resolveMaxFileSize'

export interface Media {
  stream: Response
  format: string
}

export function resolveMedia(tiktok: ItemStruct, response: Response, interaction: Interaction): Promise<Media | null> {
  const init: RequestInit = {
    headers: {
      Cookie: resolveCookie(response),
      ...TIKTOK_HEADERS,
    },
  }

  const maxFileSize = resolveMaxFileSize(interaction)

  if (tiktok.imagePost !== undefined) {
    return resolveImage(tiktok, init, maxFileSize)
  }

  if (tiktok.video.bitrateInfo !== undefined) {
    return resolveVideo(tiktok, init, maxFileSize)
  }

  return Promise.resolve(null)
}

async function resolveImage(tiktok: ItemStruct,init: RequestInit, maxFileSize: number): Promise<Media> {
  const { imagePost } = tiktok,
    imageWorkerEndpoint = environment('IMAGE_WORKER_ENDPOINT')

  if (imagePost!.images.length > 1 && imageWorkerEndpoint !== undefined) {
    const stream = await fetch(imageWorkerEndpoint + tiktok.id, {
      headers: {
        'Cf-Access-Client-Id': environment('IMAGE_WORKER_CLIENT_ID'),
        'Cf-Access-Client-Secret': environment('IMAGE_WORKER_CLIENT_SECRET'),
      },
      cf: {
        cacheEverything: true,
        cacheTtlByStatus: { '200-299': IMAGE_WORKER_CACHE_TTL },
      },
    })

    if (
      stream.ok &&
      +stream.headers.get('content-length')! <= maxFileSize
    ) {
      return {
        stream,
        format: 'mp4',
      }
    }

    await stream.body?.cancel()
  }

  return {
    stream: await fetch(imagePost!.images[0].imageURL.urlList[0], init),
    format: 'jpeg',
  }
}

async function resolveVideo(tiktok: ItemStruct, init: RequestInit, maxFileSize: number): Promise<Media | null> {
  for (const bitrateInfo of tiktok.video.bitrateInfo!) {
    if (bitrateInfo.DataSize > maxFileSize) {
      continue
    }

    for (const url of bitrateInfo.PlayAddr.UrlList) {
      const stream = await fetch(url, init)

      if (stream.headers.get('content-type') === 'text/html') {
        continue
      }

      if (+stream.headers.get('content-length')! > maxFileSize) {
        await stream.body?.cancel()
        continue
      }

      return {
        stream,
        format: 'mp4',
      }
    }
  }

  return null
}
