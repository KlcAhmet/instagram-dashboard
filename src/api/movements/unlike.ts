import * as cheerio from "cheerio"

import config from "~config.json"
import { getAllCookies } from "~helpers"





/*
-fb_dtsg-
"DTSGInitData": {
    "token": "{token}",
    "async_get_token": "{async_get_token}"
},*/
function find_FB_DTSG(textHTML: string): string | null {
  const startText: string = '"DTSGInitData":{"token":"'
  const endText: string = '","async_get_token"'
  const startIndex = textHTML.indexOf(startText)

  if (startIndex === -1) return null
  const endIndex = textHTML.indexOf(endText, startIndex)

  if (endIndex === -1) return null
  return textHTML.substring(startIndex + startText.length, endIndex)
}

/*
-variables-
"page_id": "postPage_{id}",
*/
function findVariables(textHTML: string): string | null {
  const startText: string = '"page_id":"postPage_'
  const endText: string = '",'
  const startIndex = textHTML.indexOf(startText)
  if (startIndex === -1) return null
  const endIndex = textHTML.indexOf(endText, startIndex)

  if (endIndex === -1) return null
  return textHTML.substring(startIndex + startText.length, endIndex)
}

function findHashForDocID(textHTML: string): string[] | null {
  const $ = cheerio.load(textHTML)
  return $(
    'script[src^="https://static.cdninstagram.com/rsrc.php/"][async="1"][crossorigin="anonymous"]'
  )
    .toArray()
    .map((el) => $(el).attr("src"))
}

export async function getPost(url: string): Promise<{
  variables: string
  fb_dtsg: string
  hashUrls: string[]
} | null> {
  const cookies = getAllCookies()
  let headers = new Headers()

  headers.append("x-csrftoken", cookies?.csrftoken)
  headers.append("x-ig-app-id", config.requestHeaders["x-ig-app-id"])

  const requestOptions = {
    method: "GET",
    headers: headers
  }
  const response = await fetch(url, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      return {
        fb_dtsg: find_FB_DTSG(result),
        variables: findVariables(result),
        hashUrls: findHashForDocID(result)
      }
    })
    .catch((error) => console.log("error", error))

  return response || null
}

export async function getDocId(hashs: string[]): Promise<string | void> {
  function findDocId(textHTML: string): string | null {
    const startText: string =
      'name:"usePolarisLikeMediaUnlikeMutation",selections:b},params:{id:"'
    const endText: string =
      '",metadata:{},name:"usePolarisLikeMediaUnlikeMutation",'
    const startIndex = textHTML.indexOf(startText)
    if (startIndex === -1) return null
    const endIndex = textHTML.indexOf(endText, startIndex)

    if (endIndex === -1) return null
    return textHTML.substring(startIndex + startText.length, endIndex)
  }

  const fetchUrl = async (url) => {
    const response = await fetch(url)
    return await response.text()
  }

  const fetchPromises = hashs.map((url) => fetchUrl(url))

  const response = Promise.all(fetchPromises)
    .then((results) => {
      return results
        .map((result) => findDocId(result))
        .filter((result) => result)[0]
    })
    .catch((error) => {
      console.error("Hata oluştu:", error)
    })

  return response || null
}

export async function postUnlike(url: string): Promise<boolean> {
  const cookies = getAllCookies()
  let headers = new Headers()

  headers.append("x-csrftoken", cookies?.csrftoken)

  const params = await getPost(url)
  console.log(params)
  if (!params) return false

  const doc_id = await getDocId(params.hashUrls)
  if (!doc_id) return false

  let urlencoded = new URLSearchParams()
  urlencoded.append("fb_dtsg", params.fb_dtsg)
  urlencoded.append("variables", `{"media_id":"${params.variables}"}`)
  urlencoded.append("doc_id", doc_id)

  let requestOptions = {
    method: "POST",
    headers: headers,
    body: urlencoded
  }

  return fetch("https://www.instagram.com/api/graphql", requestOptions)
    .then((response) => response.json())
    .then(() => true)
    .catch((error) => {
      console.log("error", error)
      return false
    })
}
