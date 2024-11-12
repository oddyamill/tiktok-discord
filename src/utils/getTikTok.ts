import { TIKTOK_ENDPOINT } from '../constants'
import { TranslatorKey } from '../localization'
import { ItemStruct, VideoDetail } from '../tiktok'

// enum like
const ErrorMessage: Record<string, TranslatorKey> = {
  VideoForCreator: 'video_for_creator',
  VideoForFriends: 'video_for_friends',
  VideoForSubscriber: 'video_for_subscriber',
  VideoPrivate: 'video_private',
  VideoAgeRestricted: 'video_age_restricted',
  VideoDeleted: 'video_deleted',
  VideoNotFound: 'video_not_found',
  ServiceUnavailable: 'service_unavailable',
}

function resolveErrorMessage(videoDetail: VideoDetail): TranslatorKey {
  const { statusMsg, statusCode } = videoDetail
  console.debug('video', videoDetail)

  switch (true) {
    case statusMsg.includes('status_self_see'):
      return ErrorMessage.VideoForCreator
    case statusMsg.includes('status_friend_see'):
      return ErrorMessage.VideoForFriends
    case statusMsg.includes('author_secret'):
      return ErrorMessage.VideoForSubscriber
    case statusCode === 10222:
      return ErrorMessage.VideoPrivate
    case statusMsg.includes('content_classification'):
      return ErrorMessage.VideoAgeRestricted
    case statusMsg.includes('status_deleted'):
    case statusMsg.includes('vigo'):
      return ErrorMessage.VideoDeleted
    case statusMsg === "item doesn't exist":
    case statusCode === 10204:
      return ErrorMessage.VideoNotFound
    default:
      return ErrorMessage.ServiceUnavailable
  }
}

export async function getTikTok(
  id: string,
): Promise<[ItemStruct, Response, null] | [null, null, TranslatorKey]> {
  const url = TIKTOK_ENDPOINT + id
  const response = await fetch(url)

  if (!response.ok) {
    return [null, null, ErrorMessage.ServiceUnavailable]
  }

  try {
    const videoDetail = JSON.parse(
      (await response.text())
        .split(
          '<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">',
        )[1]
        .split('</script>')[0],
    ).__DEFAULT_SCOPE__['webapp.video-detail'] as VideoDetail

    if (videoDetail.itemInfo === undefined) {
      return [null, null, resolveErrorMessage(videoDetail)]
    }

    return [videoDetail.itemInfo.itemStruct, response, null]
  } catch (error) {
    console.error('getTiktok error', error)
  }

  return [null, null, ErrorMessage.ServiceUnavailable]
}
