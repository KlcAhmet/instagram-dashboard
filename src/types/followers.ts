export type TFollowed = {
  user: TUserList
  status: "unfollowed" | "followed"
  created_at: string
}

export type TFollowersList = {
  status_execute: TStatusExecute
  next_max_id?: string
  users: Array<TUserList>
  last_users_log: Array<TUserList>
  follow_logs: Array<TFollowed>
}

export type TUserList = {
  pk: string
  pk_id: string
  username: string
  full_name: string
  is_private: boolean
  fbid_v2: string
  strong_id__: string
  profile_pic_id: string
  profile_pic_url: string
  is_verified: boolean
  has_anonymous_profile_picture: boolean
}

export type TStatusExecute =
  | "idle"
  | "running"
  | "pending"
  | "finished"
  | "error"
