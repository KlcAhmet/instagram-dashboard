import { useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "src/store"

import { postUnfollow } from "~api"
import { ListButton, ListItem } from "~components/list-items"
import { Loading } from "~components/loading"
import { ListItemMap } from "~helpers"
import { updateUserIndexedDB } from "~indexedDB"
import { setFollowing, type TUserState } from "~store/userSlice"

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
  const statusExecute = useMemo(() => {
    if (
      user.followers.status_execute === "running" ||
      user.following.status_execute === "running"
    )
      return true
    return false
  }, [user.followers.status_execute, user.following.status_execute])
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
                <p>
                  Takip Etmeyenler:{" "}
                  {statusExecute || !followersUsers.length
                    ? null
                    : following().length}
                </p>
                {statusExecute || !followersUsers.length ? (
                  <div className="h-4">
                    <Loading />
                  </div>
                ) : (
                  ListItemMap(following()).map((item) => {
                    let isPending = false
                    item.children = {
                      button: ListButton(
                        {
                          onClick: () => {
                            isPending = true
                            console.log("isPending", isPending)

                            postUnfollow(item.user.pk).then((data) => {
                              function filterFollowing() {
                                return followingUsers.filter((item2) => {
                                  if (item2.pk === item.user.pk) return null
                                  return item2
                                })
                              }

                              if (data) {
                                const filteredList = filterFollowing()
                                dispatch(
                                  setFollowing({
                                    users: filteredList
                                  })
                                )
                                updateUserIndexedDB({
                                  ...user,
                                  following: {
                                    ...user.following,
                                    users: filteredList
                                  }
                                })
                              }
                              isPending = false
                              console.log("isPending", isPending)
                            })
                          }
                        },
                        "X"
                      )
                    }
                    return <ListItem {...item} key={`${item.user.pk}`} />
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
