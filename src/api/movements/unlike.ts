import config from "~config.json"
import { getAllCookies } from "~helpers"





/*
unlike

variables: "page_id": "postPage_3192432942705026151",

doc_id:  <script src="https://static.cdninstagram.com/rsrc.php/v3iCYI4/y8/l/makehaste_jhash/_SaD8dG4YG43s1xTRi65WVSXMX--ykgWcd6G11ErteRPKx7l7itV0BXappxhWHMZSX.js?_nc_x=Ij3Wp8lg5Kz" data-bootloader-hash="MLJzGmE" async="1" crossorigin="anonymous" data-tsrc="https://static.cdninstagram.com/rsrc-translations.php/v6icfU4/yF/l/tr_TR/_SaD8dG4YG43s1xTRi65WVSXMX--ykgWcd6G11ErteRPKx7l7itV0BXappxhWHMZSX.js?_nc_x=Ij3Wp8lg5Kz" data-p=":38,15,21,161,115,16" data-btmanifest="1010545497_main" data-c="1" nonce="7KPyCtin"></script>
*/

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

function findHashForDocID(textHTML: string): string | null {
  const startText: string =
    '<script src="https://static.cdninstagram.com/rsrc.php/'
  const endText: string =
    '" async="1" crossorigin="anonymous" data-tsrc="https://static.cdninstagram.com/rsrc-translations.php/'
  const startIndex = textHTML.indexOf(startText)
  if (startIndex === -1) return null
  const endIndex = textHTML.indexOf(endText, startIndex)

  console.log(1, textHTML.substring(startIndex + startText.length, endIndex))
  console.log(2, textHTML.substring(startIndex, endIndex))
  if (endIndex === -1) return null
  const scriptText = textHTML.substring(startIndex + startText.length, endIndex)

  return scriptText.substring(0, scriptText.indexOf('" data-bootloader-hash'))
}

function findDocId(textHTML: string): string | null {
  const startText: string =
    'kind:"Operation",name:"usePolarisLikeMediaUnlikeMutation",selections:b},params:{id:"'
  const endText: string = '",metadata'
  const startIndex = textHTML.indexOf(startText)
  if (startIndex === -1) return null
  const endIndex = textHTML.indexOf(endText, startIndex)

  if (endIndex === -1) return null
  return textHTML.substring(startIndex + startText.length, endIndex)
}

function findNC_X(textHTML: string): string | null {
  const startText: string = "nc_x="
  const startIndex = textHTML.indexOf(startText)
  if (startIndex === -1) return null

  return textHTML.substring(startIndex + startText.length, textHTML.length)
}

export async function getPost(url: string): Promise<{
  variables: string
  fb_dtsg: string
  hashUrl: string
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
        hashUrl: findHashForDocID(result)
      }
    })
    .catch((error) => console.log("error", error))

  return response || null
}

export async function getDocId(hash: string): Promise<string | void> {
  let requestOptions = {
    method: "GET"
  }

  const response = fetch(
    `https://static.cdninstagram.com/rsrc.php/v3ihwc4/yc/l/makehaste_jhash/${hash}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => findDocId(result))
    .catch((error) => console.log("error", error))

  return response || null
}

export async function postUnlike(url: string): Promise<boolean> {
  const cookies = getAllCookies()
  let headers = new Headers()

  headers.append("x-csrftoken", cookies?.csrftoken)

  const params = await getPost(url)
  console.log(params)
  if (!params) return false
  /*const doc_id = await getDocId(params.hashUrl)
  console.log("doc_id", doc_id)*/

  /*let urlencoded = new URLSearchParams();
  urlencoded.append("fb_dtsg", params.fb_dtsg);
  urlencoded.append("variables", `{"media_id":"${params.variables}"}`);
  urlencoded.append("doc_id", params.doc_id);

  let requestOptions = {
    method: 'POST',
    headers: headers,
    body: urlencoded,
  };

  fetch("https://www.instagram.com/api/graphql", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));*/

  return true
}
