import type { TFollowersList } from "src/types"

import config from "~config.json"
import HttpStatusCode from "~enums/http-status-codes"
import { getAllCookies } from "~helpers"





type TRequestUrl = {
  maxId?: string
  type: "followers" | "following"
  ds_user_id: string
}

const requestUrl = ({ maxId, type, ds_user_id }: TRequestUrl): string => {
  const count = type === "followers" ? 23 : 50
  if (maxId)
    return `https://www.instagram.com/api/v1/friendships/${ds_user_id}/${type}/?count=${count}&max_id=${maxId}`
  else
    return `https://www.instagram.com/api/v1/friendships/${ds_user_id}/${type}/?count=${count}`
}

async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url)
  const blob = await response.blob()
  return await new Promise((callback) => {
    let reader = new FileReader()
    reader.onload = function () {
      callback(this.result as string)
    }
    reader.readAsDataURL(blob)
  })
}

export async function getFollowList({
  maxId,
  type
}: Partial<TRequestUrl>): Promise<Partial<TFollowersList> | HttpStatusCode> {
  const { csrftoken, ds_user_id } = getAllCookies()
  let headers = new Headers()

  headers.append("x-csrftoken", csrftoken)
  headers.append("x-ig-app-id", config.requestHeaders["x-ig-app-id"])

  const requestOptions = {
    method: "GET",
    headers: headers
  }

  const response = await fetch(
    requestUrl({ maxId, type, ds_user_id }),
    requestOptions
  )
    .then((response) => {
      if (response.status !== HttpStatusCode.OK_200) return response.status

      return response.json()
    })
    .catch((error) => console.log("error", error))

  const { next_max_id, users }: Partial<TFollowersList> = await response

  const usersWithBase64Images = await Promise.all(
    users.map(async (item) => {
      const imageUrl = item.profile_pic_url

      const base64ImgSrc = await urlToBase64(imageUrl)
      return {
        ...item,
        profile_pic_url: base64ImgSrc
      }
    })
  )

  return {
    next_max_id,
    users: usersWithBase64Images
  }
}
