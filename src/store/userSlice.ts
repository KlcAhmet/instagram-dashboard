import { createSlice } from "@reduxjs/toolkit"

import type { TFollowersList, TPosts, TUserProfile } from "~types"





export type TUserState = TUserProfile & {
  followers: TFollowersList
  following: TFollowersList
  likes: {
    liked_posts: TPosts
  }
}

const userSlice = createSlice({
  name: "user",
  initialState: <TUserState>{
    id: "",
    ds_user_id: "",
    full_name: "",
    "edge_followed_by.count": 0,
    "edge_follow.count": 0,
    profile_pic_url: "",
    profile_pic_url_hd: "",
    username: "",
    biography: "",
    hide_like_and_view_counts: false,
    is_business_account: false,
    is_professional_account: false,
    is_private: false,
    is_verified: false,
    edge_mutual_followed_by: {
      count: 0,
      edges: []
    },
    is_joined_recently: false,
    followers: {
      status_execute: "idle",
      next_max_id: "",
      users: [],
      last_users_log: [],
      follow_logs: []
    },
    following: {
      status_execute: "idle",
      next_max_id: "",
      users: [],
      last_users_log: [],
      follow_logs: []
    },
    likes: {
      liked_posts: {
        likes_media_likes: [],
        status_execute: "idle",
        filter: {
          followers: false,
          following: false
        }
      }
    }
  },
  reducers: {
    setUser: (state, action) => {
      console.log("setUser action.payload", action.payload)
      return {
        ...state,
        ...action.payload
      }
    },
    setFollowers: (state, action) => {
      console.log("setFollowers action.payload", action.payload)
      return {
        ...state,
        followers: {
          ...state.followers,
          ...action.payload
        }
      }
    },
    setFollowing: (state, action) => {
      console.log("setFollowing action.payload", action.payload)
      return {
        ...state,
        following: {
          ...state.following,
          ...action.payload
        }
      }
    },
    setLikesMediaLikes: (state, action) => {
      console.log("setLikesMediaLikes action.payload", action.payload)
      return {
        ...state,
        likes: {
          liked_posts: {
            ...state.likes.liked_posts,
            likes_media_likes: action.payload
          }
        }
      }
    },
    setLikesMediaLikesStatusExecute: (state, action) => {
      console.log(
        "setLikesMediaLikesStatusExecute action.payload",
        action.payload
      )
      return {
        ...state,
        likes: {
          liked_posts: {
            ...state.likes.liked_posts,
            status_execute: action.payload
          }
        }
      }
    },
    setLikesMediaLikesFilter: (state, action) => {
      console.log("setLikesMediaLikesFilter action.payload", action.payload)
      return {
        ...state,
        likes: {
          liked_posts: {
            ...state.likes.liked_posts,
            filter: action.payload
          }
        }
      }
    }
  }
})
export const {
  setUser,
  setFollowers,
  setFollowing,
  setLikesMediaLikes,
  setLikesMediaLikesStatusExecute,
  setLikesMediaLikesFilter
} = userSlice.actions

export default userSlice.reducer
