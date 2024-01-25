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

export async function getFollowerList(
  maxId: string
): Promise<Partial<TFollowersList> | HttpStatusCode> {
  const cookies = getAllCookies()
  let headers = new Headers()

  headers.append("x-csrftoken", cookies?.csrftoken)
  headers.append("x-ig-app-id", config.requestHeaders["x-ig-app-id"])

  const requestOptions = {
    method: "GET",
    headers: headers
  }

  let url: string = ""
  if (maxId)
    url = `https://www.instagram.com/api/v1/friendships/${
      cookies.ds_user_id
    }/followers/?count=${23}&max_id=${maxId}`
  else
    url = `https://www.instagram.com/api/v1/friendships/${
      cookies.ds_user_id
    }/followers/?count=${23}`

  const response = await fetch(url, requestOptions)
    .then((response) => {
      if (response.status !== HttpStatusCode.OK_200) return response.status

      return response.json()
    })
    .catch((error) => console.log("error", error))

  const { next_max_id, users }: Partial<TFollowersList> = await response

  const usersBase64Images = await Promise.all(
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
    users: usersBase64Images
  }
}

export async function getFollowingList(
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

  let url: string = ""
  if (maxId)
    url = `https://www.instagram.com/api/v1/friendships/${
      cookies.ds_user_id
    }/following/?count=${50}&max_id=${maxId}`
  else
    url = `https://www.instagram.com/api/v1/friendships/${
      cookies.ds_user_id
    }/following/?count=${50}`

  const response = await fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error))

  const { next_max_id, users }: Partial<TFollowersList> = await response

  return {
    next_max_id: next_max_id,
    users: users
  }
}
