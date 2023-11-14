import { useEffect, useState } from "react"

import dumpData from "~dumpData.json"
import { type TUserList } from "~models"





export function FollowList() {
  const [userList, setUserList] = useState(Array<TUserList>)
  const [maxID, setMaxID] = useState("")

  useEffect(() => {
    const db = dumpData["follow-first"]
    setUserList(db.users)
    setMaxID(db.next_max_id)
    /*getFollowerList().then((data) => {
      setUserList(data.users)
      setMaxID(data.next_max_id)
    })*/
  }, [])

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