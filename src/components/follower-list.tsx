import { useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "src/store"

import { getFollowList } from "~api"
import { Button, ButtonText } from "~components/cbutton"
import { ListItem, StatusBar } from "~components/list-items"
import { Loading } from "~components/loading"
import { findFollowedUsers, findUnFollowedUsers, ListItemMap } from "~helpers"
import { updateUserIndexedDB } from "~indexedDB"
import { setFollowers, setUser, type TUserState } from "~store/userSlice"
import type { TFollowed } from "~types"





export function FollowerList() {
  const dispatch = useAppDispatch()
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
      getFollowList({ maxId, type: "followers" }).then((data) => {
        if (typeof data === "number") {
          /*
           * add 404 429 status code
           */
          dispatch(
            setFollowers({
              status_execute: "finished"
            })
          )
        } else {
          dispatch(
            setFollowers({
              status_execute: "running",
              ...data,
              users: [...user.followers.users, ...data["users"]]
            })
          )
        }
      })
    }, 5000)
  }

  useEffect(() => {
    console.log("Followers useEffect started")
    if (statusExecute === "idle") {
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
        followed: lastUserLog.users.length
          ? findFollowedUsers(lastUserLog, users, followed)
          : [],
        unfollowed: lastUserLog.users
          ? findUnFollowedUsers(lastUserLog, users, unFollowed)
          : []
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
  }, [statusExecute, maxId])

  function refreshFollowes() {
    dispatch(
      setFollowers({
        status_execute: "idle",
        users: []
      })
    )
  }

  function clearLogList() {
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

  return (
    <div className="bg-light">
      <StatusBar statusExecute={statusExecute} count={users.length} />
      <div className="flex flex-row">
        <div className="basis-1/2">
          <Button className="px-1.5" onClick={() => refreshFollowes()}>
            <ButtonText text="Yenile" />
          </Button>
          <div className="max-h-[700px] overflow-y-auto space-y-1">
            {ListItemMap(users).map((item) => (
              <ListItem {...item} key={`${item.user.pk}-follower`} />
            ))}
            {statusExecute === "running" && (
              <div className="m-2">
                <Loading imgClass="h-10" animation />
              </div>
            )}
          </div>
        </div>
        <div className="basis-1/2">
          <Button className="px-1.5" onClick={() => clearLogList}>
            <ButtonText text="Tümünü Sil" />
          </Button>
          <div className="max-h-[700px] overflow-y-auto space-y-1">
            {ListItemMap(
              [...unFollowed, ...followed].sort((a, b) => {
                return (
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
                )
              })
            ).map((item, index) => (
              <ListItem {...item} key={`${item.user.pk}-follower-${index}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
