import { useEffect, useState } from "react"
import { type TUserProfile } from "src/types"

import { getUserProfile } from "~api"
import { getAllCookies } from "~helpers"





export function Profile() {
  const [user, setUser] = useState({} as TUserProfile)

  useEffect(() => {
    const cookies = getAllCookies()
    getUserProfile().then((data) => {
      setUser(data)
    })
  }, [])

  return (
    <>
      <div>
        <div className="flex flex-row items-center">
          <img
            className="rounded-full w-24 h-24 mr-5"
            src={user.profile_pic_url}
            alt="profile"
            loading="lazy"
          />
          <div className="text-center">
            <h6 className="text-xl font-bold">{user.full_name}</h6>
            <p className="text-sm">{user.username}</p>
            <div className="flex justify-center space-x-2">
              <p>Takipçi: {user["edge_followed_by.count"]}</p>
              <p>Takip: {user["edge_follow.count"]}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}