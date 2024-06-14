import type { TFollowersList } from "src/types"

import config from "~config.json"
import HttpStatusCode from "~enums/http-status-codes"
import { getAllCookies } from "~helpers"





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

type TRequestUrl = {
  next_max_id?: string
  type: "followers" | "following"
  ds_user_id: string
}

const requestUrl = ({ next_max_id, type, ds_user_id }: TRequestUrl): string => {
  const count = type === "followers" ? 23 : 50
  if (next_max_id)
    return `https://www.instagram.com/api/v1/friendships/${ds_user_id}/${type}/?count=${count}&max_id=${next_max_id}`
  else
    return `https://www.instagram.com/api/v1/friendships/${ds_user_id}/${type}/?count=${count}`
}

export async function getFollowList({
  next_max_id,
  type
}: Partial<TRequestUrl>): Promise<
  Pick<TFollowersList, "next_max_id" | "users"> | HttpStatusCode
> {
  const { csrftoken, ds_user_id } = getAllCookies()
  let headers = new Headers()

  headers.append("x-csrftoken", csrftoken)
  headers.append("x-ig-app-id", config.requestHeaders["x-ig-app-id"])

  const requestOptions = {
    method: "GET",
    headers: headers
  }

  const response = await fetch(
    requestUrl({ next_max_id, type, ds_user_id }),
    requestOptions
  )
    .then((response) => {
      if (response.status !== HttpStatusCode.OK_200) return response.status

      return response.json()
    })
    .catch((error) => console.log("error", error))

  const data: Awaited<
    Pick<TFollowersList, "next_max_id" | "users"> | HttpStatusCode
  > = await response

  if (typeof data === "number") return data

  const usersWithBase64Images = await Promise.all(
    data.users.map(async (item) => {
      const base64ImgSrc: Awaited<string> = await urlToBase64(
        item.profile_pic_url
      )
      return {
        ...item,
        profile_pic_url: base64ImgSrc
      }
    })
  )

  return {
    ...data,
    users: usersWithBase64Images
  }
}
