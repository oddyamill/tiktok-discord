import { TIKTOK_URL_REGEXP } from '../constants'

export const resolveId = async (text: string): Promise<string | undefined> => {
  let match = text.match(TIKTOK_URL_REGEXP)

  if (match !== null) {
    try {
      const url = new URL(match[0])

      switch (url.hostname) {
        case 'vm.tiktok.com':
        case 'vt.tiktok.com': {
          const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'manual',
          })

          const location = response.headers.get('location')
          if (location === null) {
            return
          }

          match = location.match(TIKTOK_URL_REGEXP)
          if (match === null) {
            return
          }
        }

        case 'tiktok.com':
        case 'm.tiktok.com':
        case 'www.tiktok.com': {
          return match[match.length - 1]
        }
      }
    } catch {}

    return
  }

  return text.match(/\d+/)?.[0]
}