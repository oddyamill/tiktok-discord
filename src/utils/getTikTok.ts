import { TIKTOK_ENDPOINT } from '../constants'
import { resolveMedia } from './resolveMedia'
import { TikTok } from '../tiktok'
import { Env } from '../env'

export const getTikTok = async (id: string, env: Env) => {
  const url = TIKTOK_ENDPOINT + id
  const response = await fetch(url)

  if (!response.ok) {
    return
  }

  try {
    const html = await response.text()

    if (!html.includes('__UNIVERSAL_DATA_FOR_REHYDRATION__')) {
      return
    }

    const data = JSON.parse(
      html.split('<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">')[1].split('</script>')[0]
    )

    const tiktok =
      data.__DEFAULT_SCOPE__['webapp.video-detail'].itemInfo.itemStruct as TikTok

    return {
      url,
      author: tiktok.author,
      ...await resolveMedia(response, tiktok, env),
    }
  } catch (error) {
    console.error(error)
  }
}
