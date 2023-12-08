import { useEffect, useMemo, useState } from "react"

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

function ComparisonList({ list }) {
  return (
    <div>
      {/*      <div>
        <button
          type="button"
          className="ml-2 border-2 border-blue-500"
          onClick={() => {
            dispatch(
              setFollowers({
                ...user.followers,
                unfollowed: []
              })
            )
          }}>
          listeyi temizle
        </button>
      </div>*/}
      {list.map((item) => (
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
      ))}
    </div>
  )
}

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
          last_user_log: {
            users: user.followers.users,
            created_at: new Date().toISOString()
          },
          unfollowed: findUnFollowedUsers(),
          status_execute: "finished"
        })
      )
      updateUserIndexedDB({
        ...user,
        followers: {
          ...user.followers,
          last_user_log: {
            users: user.followers.users,
            created_at: new Date().toISOString()
          },
          unfollowed: findUnFollowedUsers(),
          status_execute: "finished"
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
          <button
            type="button"
            className="ml-2 border-2 border-blue-500"
            onClick={() => {
              dispatch(
                setFollowers({
                  ...user.followers,
                  users: []
                })
              )
              updateFollowersStatusExecute("idle")
            }}>
            yenile
          </button>
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
            <ComparisonList list={unFollowed} />
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