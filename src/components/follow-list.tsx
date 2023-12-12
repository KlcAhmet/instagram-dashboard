import { useEffect, useMemo, useState, type ReactNode } from "react"

import { getFollowerList } from "~api"
import { findFollowedUsers, findUnFollowedUsers } from "~helpers"
import { updateUserIndexedDB } from "~indexedDB"
import { useAppDispatch, useAppSelector } from "~store"
import { setFollowers, type TUserState } from "~store/userSlice"
import type { TFollowed, TUserList } from "~types"

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
  const lastUserLog = useMemo(() => {
    return user.followers.last_user_log
  }, [user.followers.last_user_log])
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
            status_execute: "running",
            ...data,
            users: [...user.followers.users, ...data["users"]]
          })
        )
      })
    }, 1500)
  }

  useEffect(() => {
    if (activeFollowList && statusExecute === "idle") {
      init()
    } else if (maxId && statusExecute === "running") {
      init()
    } else if (!maxId && statusExecute === "running") {
      const followers = {
        status_execute: "finished",
        last_user_log: {
          users: user.followers.users,
          created_at: new Date().toISOString()
        },
        followed: findFollowedUsers(lastUserLog, users, followed),
        unfollowed: findUnFollowedUsers(lastUserLog, users, unFollowed)
      }
      dispatch(setFollowers(followers))
      updateUserIndexedDB({
        ...user,
        followers: {
          ...user.followers,
          ...followers
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
          <div className="flex flex-nowrap">
            <div className="w-72">
              {ListButton(
                {
                  onClick: () => {
                    dispatch(
                      setFollowers({
                        status_execute: "idle",
                        users: []
                      })
                    )
                  }
                },
                "Yenile"
              )}
              <div className="max-h-[500px] overflow-y-scroll">
                {ListItem(users)}
              </div>
            </div>
            <div className="w-72">
              {ListButton(
                {
                  onClick: () => {
                    dispatch(
                      setFollowers({
                        unfollowed: []
                      })
                    )
                  }
                },
                "Listeyi Temizle"
              )}
              <div className="max-h-[500px] overflow-y-scroll">
                {ListItem(
                  [...unFollowed, ...followed].sort((a, b) => {
                    return (
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                    )
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

const ListItem = (items: Array<TFollowed | TUserList | any>) => {
  const users = items.map((item) => {
    if (item?.user) return item
    return { user: item }
  })
  return users.map((item) => {
    const background = () => {
      if (item.status === "unfollowed") return "bg-red-700"
      else if (item.status === "followed") return "bg-green-700"
      else return "bg-teal-900"
    }
    const createdAt = item?.created_at
      ? new Date(item?.created_at).toISOString()
      : null

    return (
      <div
        key={`${item.user.pk}-${new Date(item?.created_at)}`}
        className={"flex flex-nowrap items-center mb-1 " + background()}>
        <div>
          <img
            className="rounded-full w-14"
            src={item.user.profile_pic_url}
            alt="userimg"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col flex-grow ml-2">
          <p className="">{item.user.username}</p>
          {item?.status ? <p className="">{item?.status}</p> : null}
          {item?.created_at ? <p className="">{createdAt}</p> : null}
        </div>
      </div>
    )
  })
}