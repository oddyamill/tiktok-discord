export function resolveCookie(response: Response): string {
  const setCookies = response.headers.get('set-cookie')

  if (setCookies === null) {
    return ''
  }

  return setCookies
    .split(',')
    .map((chunk) => chunk.trim().split(';')[0])
    .filter((chunk) => chunk.includes('='))
    .join('; ')
}
