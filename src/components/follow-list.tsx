import { useEffect, useMemo, useState, type ReactNode } from "react"

import { getFollowerList } from "~api"
import { updateUserIndexedDB } from "~indexedDB"
import { useAppDispatch, useAppSelector } from "~store"
import {
  setFollowers,
  setFollowersStatusExecute,
  type TUserState
} from "~store/userSlice"
import type { TFollowed, TStatusExecute, TUserList } from "~types"

import followersIcon from "../appassets/followers.png"

export function FollowList() {
  const dispatch = useAppDispatch()
  const [activeFollowList, setActiveFollowList] = useState(false)
  const user: TUserState = useAppSelector((state) => state.user)

  const maxId = useMemo(() => {
    return user.followers.next_max_id
  }, [user.followers.next_max_id])
  const users = useMemo(() => {
    return user.followers.users
  }, [user.followers.users])
  const statusExecute = useMemo(() => {
    return user.followers.status_execute
  }, [user.followers.status_execute])
  const lastUserLogs = useMemo(() => {
    return user.followers.last_user_log.users
  }, [user.followers.last_user_log.users])
  const unFollowed: Array<TFollowed> = useMemo(() => {
    return user.followers.unfollowed
  }, [user.followers.unfollowed])
  const followed: Array<TFollowed> = useMemo(() => {
    return user.followers.followed
  }, [user.followers.followed])

  function init() {
    setTimeout(() => {
      getFollowerList(maxId).then((data) => {
        dispatch(
          setFollowers({
            ...user.followers,
            status_execute: "running",
            ...data,
            users: [...user.followers.users, ...data["users"]]
          })
        )
      })
    }, 1500)
  }

  function updateFollowersStatusExecute(status: TStatusExecute) {
    dispatch(setFollowersStatusExecute(status))
  }

  function findUnFollowedUsers(): Array<TFollowed> {
    const unfollowedUsers = lastUserLogs.filter((user) => {
      return !users.find((u) => u.pk === user.pk)
    })
    const mappedUnfollowedUsers = unfollowedUsers
      .map((user: TUserList) => {
        return {
          user,
          status: "unfollowed",
          created_at: new Date().toISOString()
        }
      })
      .filter((user) => user !== null)
    mappedUnfollowedUsers.push(...unFollowed)

    return mappedUnfollowedUsers
  }

  function findFollowedUsers(): Array<TFollowed> {
    const followedUsers = users.filter((user) => {
      return !lastUserLogs.find((u) => u.pk === user.pk)
    })

    const mappedFollowedUsers = followedUsers
      .map((user: TUserList) => {
        return {
          user,
          status: "followed",
          created_at: new Date().toISOString()
        }
      })
      .filter((user) => user !== null)
    mappedFollowedUsers.push(...followed)
    console.log(mappedFollowedUsers)
    return mappedFollowedUsers
  }

  useEffect(() => {
    if (activeFollowList && statusExecute === "idle") {
      init()
    } else if (maxId && statusExecute === "running") {
      init()
    } else if (!maxId && statusExecute === "running") {
      updateFollowersStatusExecute("finished")
      dispatch(
        setFollowers({
          ...user.followers,
          status_execute: "finished",
          last_user_log: {
            users: user.followers.users,
            created_at: new Date().toISOString()
          },
          followed: findFollowedUsers(),
          unfollowed: findUnFollowedUsers()
        })
      )
      updateUserIndexedDB({
        ...user,
        followers: {
          ...user.followers,
          status_execute: "finished",
          last_user_log: {
            users: user.followers.users,
            created_at: new Date().toISOString()
          },
          followed: findFollowedUsers(),
          unfollowed: findUnFollowedUsers()
        }
      })
    }
  }, [activeFollowList, statusExecute, maxId])

  return (
    <div className="border-2 border-amber-600 inline-block">
      <div>
        <button
          onClick={() => setActiveFollowList(!activeFollowList)}
          className={activeFollowList ? "flex flex-row" : "flex flex-col"}>
          <div>
            <img
              src={`${followersIcon}`}
              className="w-10 h-10 mx-auto"
              alt="followers"
            />
            <span>Takipçiler</span>
          </div>
          <StatusBar
            activeFollowList={activeFollowList}
            statusExecute={statusExecute}
            count={users.length}
          />
        </button>
      </div>
      {activeFollowList ? (
        <div>
          {ListButton(
            {
              onClick: () => {
                dispatch(
                  setFollowers({
                    ...user.followers,
                    users: []
                  })
                )
                updateFollowersStatusExecute("idle")
              }
            },
            "Yenile"
          )}
          <div className="flex flex-nowrap">
            <div>
              {users.map((user) => (
                <div key={user.pk} className="flex flex-nowrap items-center">
                  <div>
                    {/*<img
                  className="rounded-full w-14"
                  src={user.profile_pic_url}
                  alt="userimg"
                  loading="lazy"
                />*/}
                  </div>
                  <div className="flex flex-col flex-grow ml-2">
                    <p className="">{user.username}</p>
                    <div>
                      <button
                        type="button"
                        className="ml-auto border-2 border-blue-500 p-2">
                        Çıkart
                      </button>
                      <button
                        type="button"
                        className="ml-auto border-2 bborder-blue-500 p-2">
                        ---
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {ComparisonList(
              {
                listTop: ListButton(
                  {
                    onClick: () => {
                      dispatch(
                        setFollowers({
                          ...user.followers,
                          unfollowed: []
                        })
                      )
                    }
                  },
                  "Listeyi Temizle"
                )
              },
              unFollowed,
              followed
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function StatusBar({ statusExecute, activeFollowList, count }) {
  return (
    <div>
      {activeFollowList ? (
        <div>
          <p>
            status {statusExecute} : {count}
          </p>
        </div>
      ) : (
        <div>
          <p>
            {statusExecute} : {count}
          </p>
        </div>
      )}
    </div>
  )
}

function ListButton(props: object, children: ReactNode) {
  return (
    <button type="button" className="ml-2 border-2 border-blue-500" {...props}>
      {children}
    </button>
  )
}

function ComparisonList(
  children: {
    listTop?: ReactNode
  },
  unFollowed: Array<TFollowed>,
  followed: Array<TFollowed>
) {
  const ListItem = (items: Array<TFollowed>) => {
    return items.map((item) => (
      <div
        key={`${item.user.pk}-${new Date(item.created_at)}`}
        className={
          "flex flex-nowrap items-center mb-1 " +
          (item.status === "unfollowed" ? "bg-red-700" : "bg-green-700")
        }>
        <div>
          {/*<img
                  className="rounded-full w-14"
                  src={user.profile_pic_url}
                  alt="userimg"
                  loading="lazy"
                />*/}
        </div>
        <div className="flex flex-col flex-grow ml-2">
          <p className="">{item.user.username}</p>
          <p className="">{item.status}</p>
          <p className="">{`${new Date(item.created_at)}`}</p>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex flex-col">
      {children.listTop}
      <div className="max-h-80 overflow-y-scroll">{ListItem(unFollowed)}</div>
      <div className="max-h-80 overflow-y-scroll">{ListItem(followed)}</div>
    </div>
  )
}