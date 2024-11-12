import { TIKTOK_URL_REGEXP } from '../constants'

export async function resolveId(text: string): Promise<string | undefined> {
  let match = text.match(TIKTOK_URL_REGEXP)

  if (match !== null) {
    switch (match.groups?.host) {
      case 'vm.tiktok.com':
      case 'vt.tiktok.com': {
        const response = await fetch(match[0], {
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
        return match.groups?.id
      }
    }
  }

  return text.match(/\d+/)?.[0]
}
