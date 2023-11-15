export type TFollowersList = {
  next_max_id?: string
  users: Array<TUserList>
}

export type TUserList = {
  fbid_v2: string
  pk: string
  pk_id: string
  strong_id__: string
  full_name: string
  is_private: boolean
  has_anonymous_profile_picture: boolean
  username: string
  is_verified: false
  profile_pic_id: string
  profile_pic_url: string
}
