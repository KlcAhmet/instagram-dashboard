import { Suspense, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "src/store"

import { getUserProfile } from "~api"
import { Loading } from "~components/loading"
import { getAllCookies } from "~helpers"
import { getUsersIndexedDB, setUserIndexedDB } from "~indexedDB"
import { setUser, type TUserState } from "~store/userSlice"





// TODO: farklı hesap uyarısı ve hata mesajları
export function Login() {
  const dispatch = useAppDispatch()
  const user: TUserState = useAppSelector((state) => state.user)
  const cookieStore = getAllCookies()
  const [username, setUsername] = useState("")
  const [usersIndexedDB, setUsersIndexedDB] = useState([]) as any[]

  useEffect(() => {
    init()
  }, [])

  function init() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "b" }))
    setTimeout(() => {
      getUsersIndexedDB().then((db) => {
        setUsersIndexedDB(db)
      })
    }, 2000)
  }

  function passToEventListeners(key: string) {
    if (key === "n") {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "n" }))
      setUsername(username + key)
    }
    if (key === "b") {
      setUsername(username + key)
    }
  }

  function getUser() {
    getUserProfile(username).then((user) => {
      if (user.id === cookieStore.ds_user_id) {
        console.log("getUserProfile", user)
        setUserIndexedDB(user)
        dispatch(setUser(user))
      }
    })
  }

  return (
    <>
      {!user.id ? (
        <div className="space-y-3">
          <div>
            <Suspense fallback={<Loading />}>
              <UserList users={usersIndexedDB} cookieStore={cookieStore} />
            </Suspense>
          </div>
          <div>
            <label>Username: </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => passToEventListeners(e.key)}
            />
            <button type="button" onClick={getUser}>
              Get User
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

function UserList({ users, cookieStore }) {
  const dispatch = useAppDispatch()

  function getUserByUsername(username: string) {
    console.log("getUserByUsername", username)
    getUserProfile(username).then((user) => {
      if (user.id === cookieStore.ds_user_id) {
        dispatch(setUser(user))
      }
    })
  }

  return (
    <div>
      {users.map((user) => (
        <button
          key={user.id}
          type="button"
          onClick={() => getUserByUsername(user.username)}
          className="flex flex-row flex-nowrap items-center">
          <img
            src={user.profile_pic_url}
            className="rounded-full w-10 h-10 mr-5"
            alt="profile"
            loading="lazy"
          />
          <span>{user.username}</span>
        </button>
      ))}
    </div>
  )
}
