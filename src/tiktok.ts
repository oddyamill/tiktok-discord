export interface VideoDetail {
  statusCode: number
  statusMsg: string
  itemInfo?: {
    itemStruct: ItemStruct
  }
}

export interface ItemStruct {
  id: string
  video: {
    bitrateInfo?: { PlayAddr: { UrlList: [string] }; DataSize: number }[]
  }
  imagePost?: { images: [{ imageURL: { urlList: string } }] }
  author: Author
}

export interface Author {
  id: string
  nickname: string
  uniqueId: string
  avatarThumb: string
}
