import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "src/store"

import { Button, ButtonText } from "~components/cbutton"
import { Input, InputError, InputLayout } from "~components/cinput"
import { Loading, LoadingInfoText } from "~components/loading"
import { bypassWindowEventForKeys } from "~helpers"
import { getUsersIndexedDB } from "~indexedDB"
import { type TUserState } from "~store/userSlice"
import { fetchUser, setErrorMessage } from "~store/userSlice2"
import type { TUserProfile } from "~types"





export function Login() {
  const dispatch = useAppDispatch()
  const userStatus = useAppSelector((state) => state.user2.status)
  const errorMessage = useAppSelector((state) => state.user2.error)
  const username = useRef(null)

  function loginUser(user?: TUserProfile) {
    dispatch(
      fetchUser({
        username: user ? user.username : username.current.value,
        currentUser: user
      })
    )
  }

  function setUsername(key: string) {
    username.current.value += key
    if (errorMessage) dispatch(setErrorMessage(null))
  }

  return (
    <>
      <div className="space-y-3 bg-navy rounded-xl p-6 w-[300px]">
        <UserList loginUser={loginUser} className="mb-10" />
        <div className="flex flex-col">
          <InputLayout header="Username">
            <Input
              ref={username}
              placeholder="_"
              onKeyDown={(e) => setUsername(bypassWindowEventForKeys(e.key))}
            />
            <InputError text={errorMessage && `${errorMessage}`} />
          </InputLayout>
          <Button
            loading={userStatus === "loading"}
            onClick={() => loginUser()}
            big>
            <ButtonText text="Login" big />
          </Button>
        </div>
      </div>
    </>
  )
}

function UserList({ loginUser, ...props }) {
  const [usersIndexedDB, setUsersIndexedDB] = useState([]) as any[]
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsersIndexedDB().then((result) => {
      setUsersIndexedDB(result)
      //loginUser(result[0])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <Loading
        direction="row"
        imgClass="h-7"
        animation
        children={LoadingInfoText({
          text: "Kayıtlı kullanıcılar yükleniyor...",
          className: "ml-3 text-sm font-normal"
        })}
      />
    )
  }
  if (usersIndexedDB.length === 0) return null

  return (
    <div className={props.className}>
      {usersIndexedDB.map((user: TUserState) => (
        <button
          key={user.id}
          type="button"
          onClick={() => loginUser(user)}
          className="flex flex-row flex-nowrap items-center">
          <img
            src={user.profile_pic_url}
            className="rounded-full w-14 mr-5"
            alt="profile"
            loading="lazy"
          />
          <div className="text-start">
            <h6 className="text-secondary text-base line-clamp-1">
              {user.full_name}
            </h6>
            <span className="text-brown text-sm line-clamp-1">
              @{user.username}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
