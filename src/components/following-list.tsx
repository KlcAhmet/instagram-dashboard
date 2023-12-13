import { useEffect, useMemo, useState } from "react"

import { getFollowingList } from "~api"
import { ListButton, ListItem, StatusBar } from "~components/list-items"
import { Loading } from "~components/loading"
import { findFollowedUsers, findUnFollowedUsers, ListItemMap } from "~helpers"
import { updateUserIndexedDB } from "~indexedDB"
import { useAppDispatch, useAppSelector } from "~store"
import { setFollowing, setUser, type TUserState } from "~store/userSlice"
import type { TFollowed } from "~types"

import ListIcon from "../appassets/following.png"

export function FollowingList() {
  const dispatch = useAppDispatch()
  const [activeFollowList, setActiveFollowList] = useState(false)
  const user: TUserState = useAppSelector((state) => state.user)

  const maxId = useMemo(() => {
    return user.following.next_max_id
  }, [user.following.next_max_id])
  const users = useMemo(() => {
    return user.following.users
  }, [user.following.users])
  const statusExecute = useMemo(() => {
    return user.following.status_execute
  }, [user.following.status_execute])
  const lastUserLog = useMemo(() => {
    return user.following.last_user_log
  }, [user.following.last_user_log])
  const unFollowed: Array<TFollowed> = useMemo(() => {
    return user.following.unfollowed
  }, [user.following.unfollowed])
  const followed: Array<TFollowed> = useMemo(() => {
    return user.following.followed
  }, [user.following.followed])

  function init() {
    setTimeout(() => {
      getFollowingList(maxId).then((data) => {
        dispatch(
          setFollowing({
            status_execute: "running",
            ...data,
            users: [...user.following.users, ...data["users"]]
          })
        )
      })
    }, 2000)
  }

  function save() {
    const followers = {
      status_execute: "finished",
      last_user_log: {
        users: user.following.users,
        created_at: new Date().toISOString()
      },
      followed: findFollowedUsers(lastUserLog, users, followed),
      unfollowed: findUnFollowedUsers(lastUserLog, users, unFollowed)
    }
    dispatch(
      setUser({
        "edge_follow.count": users.length
      })
    )
    dispatch(setFollowing(followers))
    updateUserIndexedDB({
      ...user,
      following: {
        ...user.following,
        ...followers
      }
    })
  }

  useEffect(() => {
    if (activeFollowList && statusExecute === "idle") {
      init()
    } else if (maxId && statusExecute === "running") {
      init()
    } else if (
      !maxId &&
      (statusExecute === "running" || statusExecute === "finished")
    ) {
      console.log("save")
      console.log("users", users)
      console.log("lastUserLog", lastUserLog)
      console.log("followed", followed)
      console.log("unFollowed", unFollowed)
      save()
    }
  }, [activeFollowList, statusExecute, maxId, users])

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
            <span>Takip</span>
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
                  className:
                    statusExecute === "idle" || statusExecute === "running"
                      ? "border-2 border-red-500"
                      : undefined,
                  disabled:
                    statusExecute === "idle" || statusExecute === "running",
                  onClick: () => {
                    dispatch(
                      setFollowing({
                        status_execute: "idle",
                        users: []
                      })
                    )
                  }
                },
                "Yenile"
              )}
              <div className="max-h-[500px] overflow-y-scroll">
                {ListItemMap(users).map((item) => (
                  <ListItem {...item} key={`${item.user.pk}-following`} />
                ))}
                {statusExecute === "running" || !users.length ? (
                  <div className="h-4">
                    <Loading />
                  </div>
                ) : null}
              </div>
            </div>
            <div className="w-72">
              {ListButton(
                {
                  onClick: () => {
                    dispatch(
                      setFollowing({
                        unfollowed: [],
                        followed: []
                      })
                    )
                    updateUserIndexedDB({
                      ...user,
                      following: {
                        ...user.following,
                        unfollowed: [],
                        followed: []
                      }
                    })
                  }
                },
                "Listeyi Temizle"
              )}
              <div className="max-h-[500px] overflow-y-scroll">
                {ListItemMap(
                  [...unFollowed, ...followed].sort((a, b) => {
                    return (
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                    )
                  })
                ).map((item, index) => (
                  <ListItem
                    {...item}
                    key={`${item.user.pk}--following-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}