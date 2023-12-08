import { createSlice } from "@reduxjs/toolkit"

import type { TFollowersList, TUserProfile } from "~types"





export type TUserState = TUserProfile & {
  followers: TFollowersList
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
    setUsername: (state, action) => {
      console.log("setUsername action.payload", action.payload)
      return {
        ...state,
        username: action.payload
      }
    },
    setFollowers: (state, action) => {
      console.log("setFollowers action.payload", action.payload)
      return {
        ...state,
        followers: action.payload
      }
    },
    setFollowersStatusExecute: (state, action) => {
      console.log("setFollowersStatusExecute action.payload", action.payload)
      return {
        ...state,
        followers: {
          ...state.followers,
          status_execute: action.payload
        }
      }
    },
    setFollowersUnfollowed: (state, action) => {
      console.log("setFollowersUnfollowed action.payload", action.payload)
      return {
        ...state,
        followers: {
          ...state.followers,
          unfollowed: action.payload
        }
      }
    },
    setFollowersFollowed: (state, action) => {
      console.log("setFollowersFollowed action.payload", action.payload)
      return {
        ...state,
        followers: {
          ...state.followers,
          followed: action.payload
        }
      }
    }
  }
})
export const {
  setUser,
  setFollowersUnfollowed,
  setUsername,
  setFollowers,
  setFollowersStatusExecute,
  setFollowersFollowed
} = userSlice.actions

export default userSlice.reducer