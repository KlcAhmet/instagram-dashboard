import type { TUserProfile } from "src/types"

import config from "~config.json"
import HttpStatusCode from "~enums/http-status-codes"
import { getAllCookies } from "~helpers"





export async function getUserProfile(
  username: string
): Promise<TUserProfile | number> {
  const cookies = getAllCookies()
  let headers = new Headers()

  headers.append("x-csrftoken", cookies?.csrftoken)
  headers.append("x-ig-app-id", config.requestHeaders["x-ig-app-id"])

  let requestOptions = {
    method: "GET",
    headers: headers
  }

  const response = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
    requestOptions
  )
    .then((response) => {
      if (response.status !== HttpStatusCode.OK_200) return response.status

      return response.json()
    })
    .catch((error) => {
      throw new Error(error.message)
    })

  if (typeof response === "number") return response

  const user = response.data.user

  return {
    id: user["id"],
    full_name: user["full_name"],
    "edge_followed_by.count": user["edge_followed_by"]["count"],
    "edge_follow.count": user["edge_follow"]["count"],
    profile_pic_url: user["profile_pic_url"],
    profile_pic_url_hd: user["profile_pic_url_hd"],
    username: user["username"],
    biography: user["biography"],
    hide_like_and_view_counts: user["hide_like_and_view_counts"],
    is_business_account: user["is_business_account"],
    is_professional_account: user["is_professional_account"],
    is_private: user["is_private"],
    is_verified: user["is_verified"],
    edge_mutual_followed_by: user["edge_mutual_followed_by"],
    is_joined_recently: user["is_joined_recently"]
  }
}

export async function postUnfollow(pk: string) {
  const cookies = getAllCookies()
  let headers = new Headers()

  headers.append("x-csrftoken", cookies?.csrftoken)
  headers.append("x-ig-app-id", config.requestHeaders["x-ig-app-id"])

  let urlencoded = new URLSearchParams()
  urlencoded.append("user_id", pk)

  let requestOptions = {
    method: "POST",
    headers: headers,
    body: urlencoded
  }

  let response = fetch(
    `https://www.instagram.com/api/v1/friendships/destroy/${pk}/`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result.status)
    .catch((error) => console.log("error", error))

  const status = await response
  return status === "ok"
}
