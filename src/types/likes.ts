type TStringListData = {
  string_list_data: Array<{
    href: string
    timestamp: number
  }>
  title: string
}

export type TPosts = {
  likes_media_likes: Array<TStringListData>
}
