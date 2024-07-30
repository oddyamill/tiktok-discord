import { TikTok } from '../tiktok'
import {
  TIKTOK_HEADERS,
  MAX_FILE_LENGTH,
  IMAGE_WORKER_CACHE_TTL,
} from '../constants'
import { resolveCookie } from './resolveCookie'
import { Env } from '../env'

export const resolveMedia = async (response: Response, tiktok: TikTok, env: Env) => {
  const init: RequestInit = {
    headers: {
      Cookie: resolveCookie(response),
      ...TIKTOK_HEADERS,
    },
  }

  if (tiktok.imagePost !== undefined) {
    return resolveImage(tiktok, init, env)
  }

  if (tiktok.video.bitrateInfo !== undefined) {
    return resolveVideo(tiktok, init)
  }

  return {}
}

const resolveImage = async (tiktok: TikTok, init: RequestInit, env: Env) => {
  const { imagePost } = tiktok

  if (imagePost!.images.length > 1 && env.IMAGE_WORKER_ENDPOINT !== undefined) {
    const stream = await fetch(env.IMAGE_WORKER_ENDPOINT + tiktok.id, {
      headers: {
        'Cf-Access-Client-Id': env.IMAGE_WORKER_CLIENT_ID,
        'Cf-Access-Client-Secret': env.IMAGE_WORKER_CLIENT_SECRET,
      },
      cf: {
        cacheEverything: true,
        cacheTtlByStatus: { '200-299': IMAGE_WORKER_CACHE_TTL },
      },
    })

    if (
      stream.ok &&
      +stream.headers.get('content-length')! <= MAX_FILE_LENGTH
    ) {
      return {
        stream,
        format: 'mp4',
      }
    }
  }

  return {
    stream: await fetch(imagePost!.images[0].imageURL.urlList[0], init),
    format: 'jpeg',
  }
}

const resolveVideo = async (tiktok: TikTok, init: RequestInit) => {
  for (const bitrateInfo of tiktok.video.bitrateInfo!) {
    if (bitrateInfo.DataSize > MAX_FILE_LENGTH) {
      continue
    }

    for (const url of bitrateInfo.PlayAddr.UrlList) {
      const stream = await fetch(url, init)

      if (stream.headers.get('content-type') === 'text/html') {
        continue
      }

      if (+stream.headers.get('content-length')! > MAX_FILE_LENGTH) {
        await stream.body?.cancel()
        continue
      }

      return {
        stream,
        format: 'mp4',
      }
    }
  }

  return {}
}
