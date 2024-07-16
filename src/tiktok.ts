export type TikTok = {
  id: string
  video: {
    bitrateInfo?: { PlayAddr: { UrlList: [string] }; DataSize: number }[]
  }
  imagePost?: { images: [{ imageURL: { urlList: string } }] }
}
