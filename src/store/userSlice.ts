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
      next_max_id: "",
      users: []
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
    }
  }
})
export const { setUser, setUsername } = userSlice.actions

export default userSlice.reducer