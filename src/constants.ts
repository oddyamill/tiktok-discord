export const TIKTOK_ENDPOINT = 'https://tiktok.com/@/video/'

export const TIKTOK_USER_ENDPOINT = 'https://tiktok.com/@'

// https://stackoverflow.com/questions/74077377/regular-expression-to-match-any-tiktok-video-id-and-url#comment130792938_74077377
export const TIKTOK_URL_REGEXP =
  /https:\/\/(?<host>(?:m|www|vm|vt)?\.?tiktok\.com)\/(?:.*\b(?:(?:usr|v|embed|user|video|photo)\/|\?shareId=|&item_id=)(?<id>\d+)|\w+)/

export const TIKTOK_HEADERS = {
  Referer: 'https://www.tiktok.com/',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
}

export const IMAGE_WORKER_CACHE_TTL = 31556952

export const EMOJI_CACHE_TTL = 604800
