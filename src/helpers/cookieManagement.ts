import { type TCookie } from "src/types"

export function getAllCookies(): TCookie {
  const cookies = document.cookie

  if (cookies === "") {
    return { csrftoken: "", dpr: "", ds_user_id: "", ig_nrcb: "", mid: "" }
  }

  const cookieArray = cookies.split(";")
  const cookieObject = {}

  for (const cookie of cookieArray) {
    const [name, value] = cookie.split("=").map((part) => part.trim()) // Her bir cookie'yi ad ve değer olarak ayır
    // @ts-ignore
    cookieObject[name] = value
  }

  return <TCookie>cookieObject
}

export function serializeCookie(obj: {} | TCookie): string {
  return Object.entries(obj)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("; ")
}