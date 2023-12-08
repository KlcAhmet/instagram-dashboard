import type { TFollowersList, TUserList } from "src/types"

import config from "~config.json"
import { getAllCookies } from "~helpers"





export async function getFollowerList(
  maxId: string
): Promise<TFollowersList | {}> {
  const cookies = getAllCookies()
  let headers = new Headers()

  headers.append("x-csrftoken", cookies?.csrftoken)
  headers.append("x-ig-app-id", config.requestHeaders["x-ig-app-id"])

  const requestOptions = {
    method: "GET",
    headers: headers
  }
  const response = await fetch(
    `https://www.instagram.com/api/v1/friendships/${
      cookies.ds_user_id
    }/followers/?count=12&${
      maxId ? `max_id=${maxId}` : "search_surface=follow_list_page"
    }`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error))

  const {
    next_max_id,
    users
  }: { next_max_id: string; users: Array<TUserList> } = await response

  return {
    next_max_id: next_max_id,
    users: users
  }
}