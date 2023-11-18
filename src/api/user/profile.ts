import type { TUserProfile } from "src/types"

import config from "~config.json"
import { getAllCookies } from "~helpers"
import { getUsersIndexedDB } from "~indexedDB"





export async function getUserProfile(username: string): Promise<TUserProfile> {
  const cookies = getAllCookies()
  let headers = new Headers()

  headers.append("x-csrftoken", cookies?.csrftoken)
  headers.append("x-ig-app-id", config.requestHeaders["x-ig-app-id"])

  let requestOptions = {
    method: "GET",
    headers: headers
  }

  let response = fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result.data.user)
    .catch((error) => console.log("error", error))

  const user = await response

  const users: [] = await getUsersIndexedDB()
  const userDB: {} = users.find((item: any) => item.ds_user_id === user.id)

  return {
    ...userDB,
    id: user["id"],
    full_name: user["full_name"],
    "edge_followed_by.count": user["edge_followed_by"]["count"],
    "edge_follow.count": user["edge_follow"]["count"],
    profile_pic_url: user["profile_pic_url"],
    username: user["username"]
  }
}