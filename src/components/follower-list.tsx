import { useEffect, useMemo, useState } from "react"

import { getFollowerList } from "~api"
import { ListButton, ListItem, StatusBar } from "~components/list-items"
import { Loading } from "~components/loading"
import { findFollowedUsers, findUnFollowedUsers, ListItemMap } from "~helpers"
import { updateUserIndexedDB } from "~indexedDB"
import { useAppDispatch, useAppSelector } from "~store"
import { setFollowers, setUser, type TUserState } from "~store/userSlice"
import type { TFollowed } from "~types"

import ListIcon from "../appassets/followers.png"

export function FollowerList() {
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
    }, 2000)
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
      dispatch(
        setUser({
          "edge_followed_by.count": users.length
        })
      )
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
              src={`${ListIcon}`}
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
                {ListItemMap(users).map((item) => (
                  <ListItem {...item} key={`${item.user.pk}-follower`} />
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
                      setFollowers({
                        unfollowed: [],
                        followed: []
                      })
                    )
                    updateUserIndexedDB({
                      ...user,
                      followers: {
                        ...user.followers,
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
                    key={`${item.user.pk}-follower-${index}`}
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