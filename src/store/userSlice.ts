import { createSlice } from "@reduxjs/toolkit"

import type { TFollowersList, TUserProfile } from "~types"





export type TUserState = TUserProfile & {
  followers: TFollowersList
  following: TFollowersList
}

const userSlice = createSlice({
  name: "user",
  initialState: <TUserState>{
    id: "",
    full_name: "",
    "edge_followed_by.count": 0,
    "edge_follow.count": 0,
    profile_pic_url: "",
    username: "",
    ds_user_id: "",
    followers: {
      status_execute: "idle",
      next_max_id: "",
      users: [],
      last_user_log: { created_at: "", users: [] },
      unfollowed: [],
      followed: []
    },
    following: {
      status_execute: "idle",
      next_max_id: "",
      users: [],
      last_user_log: { created_at: "", users: [] },
      unfollowed: [],
      followed: []
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
      console.log("setFollowers action.payload", action.payload)
      return {
        ...state,
        following: {
          ...state.following,
          ...action.payload
        }
      }
    }
  }
})
export const { setUser, setFollowers, setFollowing } = userSlice.actions

export default userSlice.reducer