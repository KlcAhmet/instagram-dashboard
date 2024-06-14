import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import config from "~config.json"
import HttpStatusCode from "~enums/http-status-codes"
import { getAllCookies } from "~helpers"
import { setUserIndexedDB, updateUserIndexedDB } from "~indexedDB"
import type { TUserProfile } from "~types"





export const fetchUser = createAsyncThunk(
  "user2/fetchUser",
  async (
    { username, currentUser }: { username: string; currentUser?: TUserProfile },
    thunkAPI
  ) => {
    const cookies = getAllCookies()
    const response = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      {
        method: "GET",
        headers: new Headers({
          "x-csrftoken": cookies?.csrftoken,
          "x-ig-app-id": config.requestHeaders["x-ig-app-id"]
        })
      }
    )
    if (response.status !== HttpStatusCode.OK_200)
      return thunkAPI.rejectWithValue(response.status)

    const {
      data: { user }
    } = await response.json()

    if (user.id !== cookies?.ds_user_id)
      return thunkAPI.rejectWithValue(HttpStatusCode.UNAUTHORIZED_401)

    const parsedUser = {
      id: user.id,
      full_name: user.full_name,
      edge_followed_by: user.edge_followed_by,
      edge_follow: user.edge_follow,
      profile_pic_url: user.profile_pic_url,
      profile_pic_url_hd: user.profile_pic_url_hd,
      username: user.username,
      biography: user.biography,
      hide_like_and_view_counts: user.hide_like_and_view_counts,
      is_business_account: user.is_business_account,
      is_professional_account: user.is_professional_account,
      is_private: user.is_private,
      is_verified: user.is_verified,
      edge_mutual_followed_by: user.edge_mutual_followed_by,
      is_joined_recently: user.is_joined_recently
    }

    if (currentUser) {
      try {
        await updateUserIndexedDB({
          ...currentUser,
          ...parsedUser
        })
      } catch (error) {
        return thunkAPI.rejectWithValue(1000)
      }
    } else {
      try {
        await setUserIndexedDB(parsedUser)
      } catch (error) {
        return thunkAPI.rejectWithValue(1001)
      }
    }
    return user
  }
)

type TUserState = {
  status: "loading" | "succeeded" | "failed" | null
  error: number | null
  user: TUserProfile
}

const userSlice2 = createSlice({
  name: "user2",
  initialState: <TUserState>{
    status: null,
    error: null,
    user: {
      id: "",
      full_name: "",
      edge_followed_by: { count: 0 },
      edge_follow: { count: 0 },
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
      is_joined_recently: false
    }
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.user = action.payload
    },
    setErrorMessage: (state, action) => {
      state.error = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        console.log("fetchUser.pending")
        state.status = "loading"
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded"
        console.log("fetchUser.fulfilled", action.payload)
        /*state.user = action.payload*/
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed"
        console.log("fetchUser.rejected", action)
        state.error = action.payload as HttpStatusCode
      })
  }
})

export const { setUserProfile, setErrorMessage } = userSlice2.actions

export default userSlice2.reducer
