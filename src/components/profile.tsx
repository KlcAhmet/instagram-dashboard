import { useEffect, useState } from "react"

import { getUserProfile } from "~api"
//import dumpData from "~dumpData.json"
import { getAllCookies } from "~helpers"





export function Profile({ name = "Extension" }) {
  const [user, setData] = useState("")

  useEffect(() => {
    const cookies = getAllCookies()
    getUserProfile().then((data) => {
      console.log(data)
    })
  }, [])

  /* useEffect(() => {}, [user])*/

  return (
    <>
      <div
        style={{
          backgroundColor: "brown",
          padding: 4
          /* position: "absolute",
           top: 0,
           left: 0*/
        }}>
        <h1>Welcome to your {name}!</h1>
        {user}
      </div>
    </>
  )
}