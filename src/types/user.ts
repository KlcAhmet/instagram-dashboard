export type TUserProfile = {
  id: string
  full_name?: string
  edge_followed_by: { count: number }
  edge_follow: { count: number }
  profile_pic_url: string
  profile_pic_url_hd: string
  username: string
  biography?: string
  hide_like_and_view_counts?: boolean
  is_business_account?: boolean
  is_professional_account?: boolean
  is_private: boolean
  is_verified?: boolean
  edge_mutual_followed_by?: {
    count: number
    edges: Array<{ node: { username: string } }>
  }
  is_joined_recently?: boolean
}
