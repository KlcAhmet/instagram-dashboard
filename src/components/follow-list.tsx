import { useEffect, useState } from "react"
import { type TUserList } from "src/types"

import { getFollowerList } from "~api"





export function FollowList() {
  const [userList, setUserList] = useState(Array<TUserList>)
  const [maxId, setMaxId] = useState("")

  useEffect(() => {
    getFollowerList(maxId).then((data) => {
      setUserList([...userList, ...data.users])
      if (data?.next_max_id) {
        setTimeout(() => {
          setMaxId(data.next_max_id)
        }, 3000)
      }
    })
  }, [maxId])

  return (
    <>
      <div className="">
        <h6>Takipçiler</h6>
        <div className="flex flex-col">
          {userList.map((user) => (
            <div key={user.pk} className="flex flex-nowrap items-center m-3">
              <div>
                <img
                  className="rounded-full w-12"
                  src={user.profile_pic_url}
                  alt="userimg"
                  loading="lazy"
                />
              </div>
              <p className="ml-2">{user.username}</p>
              <button type="button" className="ml-auto border p-2">
                Çıkart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}