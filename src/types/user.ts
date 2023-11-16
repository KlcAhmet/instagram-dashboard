export type TUserProfile = {
  id: string
  full_name?: string
  "edge_followed_by.count": number
  "edge_follow.count": number
  profile_pic_url: string
  username: string
}
