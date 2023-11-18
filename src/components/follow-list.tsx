import { useEffect, useMemo, useState } from "react"

import { getFollowerList } from "~api"
import { updateUserIndexedDB } from "~indexedDB"
import { useAppDispatch, useAppSelector } from "~store"
import {
  setFollowers,
  setFollowersStatusExecute,
  type TUserState
} from "~store/userSlice"
import type { TStatusExecute } from "~types"

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

  /*const lastUserLogs = useMemo(() => {
    return user.followers.last_user_logs
  }, [user.followers.last_user_logs])*/

  function init() {
    setTimeout(() => {
      getFollowerList(maxId).then((data) => {
        console.log(data)
        dispatch(
          setFollowers({
            ...user.followers,
            status_execute: "running",
            ...data,
            users: [...user.followers.users, ...data.users]
          })
        )
      })
    }, 1500)
  }

  function updateFollowersStatusExecute(status: TStatusExecute) {
    dispatch(setFollowersStatusExecute(status))
  }

  function saveFollowers() {
    updateUserIndexedDB({
      ...user,
      followers: {
        ...user.followers,
        last_user_logs: [
          {
            users: user.followers.users,
            created_at: new Date().toISOString()
          },
          ...(user.followers.last_user_logs ?? undefined)
        ]
      }
    })
    dispatch(
      setFollowers({
        ...user.followers,
        last_user_logs: [
          {
            users: user.followers.users,
            created_at: new Date().toISOString()
          },
          ...user.followers.last_user_logs
        ]
      })
    )
  }

  useEffect(() => {
    if (activeFollowList && statusExecute === "idle") {
      init()
    } else if (maxId && statusExecute === "running") {
      init()
    } else if (!maxId && statusExecute === "running") {
      updateFollowersStatusExecute("finished")
      updateUserIndexedDB({
        ...user,
        followers: {
          ...user.followers,
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
        <div className="w-80">
          <button type={"button"} onClick={saveFollowers} className="ml-2">
            kaydet
          </button>
          <button
            type={"button"}
            onClick={() => {
              dispatch(
                setFollowers({
                  ...user.followers,
                  users: []
                })
              )
              updateFollowersStatusExecute("idle")
            }}
            className="ml-2">
            yenile
          </button>
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
                  <button type="button" className="ml-auto border p-2">
                    Çıkart
                  </button>
                  <button type="button" className="ml-auto border p-2">
                    ---
                  </button>
                </div>
              </div>
            </div>
          ))}
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