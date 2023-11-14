import { useEffect, useState } from "react"

import { getUserProfile } from "~api"
import { getAllCookies } from "~helpers"
import { type TUserProfile } from "~models"





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
      <div className="w-96">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-center">
            <img
              className="rounded-full w-24 h-24"
              src={user.profile_pic_url}
              alt="profile"
              loading="lazy"
            />
          </div>
          <div className="text-center">
            <h6 className="text-xl font-bold">{user.full_name}</h6>
            <p className="text-sm">{user.username}</p>
          </div>
          <div className="flex justify-center space-x-2">
            <p>Takipçi: {user["edge_followed_by.count"]}</p>
            <p>Takip: {user["edge_follow.count"]}</p>
          </div>
        </div>
      </div>
    </>
  )
}