export type TFollowersList = {
  status_execute: TStatusExecute
  next_max_id?: string
  users: Array<TUserList>
  last_user_logs: Array<{
    users: Array<TUserList>
    created_at: string
  }>
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

export type TStatusExecute =
  | "idle"
  | "running"
  | "pending"
  | "finished"
  | "error"
