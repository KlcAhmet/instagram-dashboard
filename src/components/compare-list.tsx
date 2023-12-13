import { useMemo, useState } from "react"

import { ListButton, ListItem } from "~components/list-items"
import { ListItemMap } from "~helpers"
import { useAppDispatch, useAppSelector } from "~store"
import { type TUserState } from "~store/userSlice"

import ListIcon from "../appassets/compare.png"

export function CompareList() {
  const dispatch = useAppDispatch()
  const [activeFollowList, setActiveFollowList] = useState(false)
  const user: TUserState = useAppSelector((state) => state.user)
  const followingUsers = useMemo(() => {
    return user.following.users
  }, [user.following.users])
  const followersUsers = useMemo(() => {
    return user.followers.users
  }, [user.followers.users])
  const [followingList, setFollowingList] = useState([])

  function following() {
    return followingUsers.filter((item) => {
      if (followersUsers.find((item2) => item2.username === item.username))
        return null
      return item
    })
  }

  return (
    <div className="border-2 border-fuchsia-600 inline-block">
      <div>
        <button
          onClick={() => setActiveFollowList(!activeFollowList)}
          className={activeFollowList ? "flex flex-row" : "flex flex-col"}>
          <div>
            <img
              src={`${ListIcon}`}
              className="w-10 h-10 mx-auto"
              alt="following"
            />
            <span>Liste Karşılaştır</span>
          </div>
        </button>
      </div>
      {activeFollowList ? (
        <div>
          <div className="flex flex-nowrap">
            <div className="w-72">
              <div className="max-h-[500px] overflow-y-scroll">
                <p>Takip Etmeyenler: {following.length}</p>
                {ListItemMap(following()).map((item) => {
                  item.children = {
                    button: ListButton(
                      {
                        onClick: () => {
                          console.log(item)
                          /*dispatch(
                            setFollowing({
                              unfollowed: [],
                              followed: []
                            })
                          )*/
                        }
                      },
                      "X"
                    )
                  }
                  return <ListItem {...item} key={`${item.user.pk}`} />
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}