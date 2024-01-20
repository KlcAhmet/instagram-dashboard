import { useEffect, useRef, useState } from "react"
import { useAppDispatch } from "src/store"

import { getUserProfile } from "~api"
import { Button, ButtonText } from "~components/cbutton"
import { Input, InputError, InputLayout } from "~components/cinput"
import { Loading, LoadingInfoText } from "~components/loading"
import { bypassWindowEventForKeys, getAllCookies } from "~helpers"
import {
  getUsersIndexedDB,
  setUserIndexedDB,
  updateUserIndexedDB
} from "~indexedDB"
import { setUser, type TUserState } from "~store/userSlice"





export function Login({ isLogin }) {
  const dispatch = useAppDispatch()
  const cookieStore = getAllCookies()
  const username = useRef(null)
  const [loginButtonLoading, setLoginButtonLoading] = useState(false)
  const [errorMessages, setErrorMessages] = useState(null)

  function loginUser(user?: TUserState) {
    setLoginButtonLoading(true)
    getUserProfile(user ? user.username : username.current.value)
      .then((data) => {
        if (data.id === cookieStore.ds_user_id) {
          const userData = {
            ...user,
            ...data
          }
          if (user) {
            updateUserIndexedDB(userData).then(() => {
              dispatch(setUser(userData))
              isLogin(true)
            })
          } else {
            setUserIndexedDB(userData)
              .then(() => {
                dispatch(setUser(userData))
                isLogin(true)
              })
              .catch(() => {
                setErrorMessages("Bu kullanıcı zaten kayıtlı")
                setLoginButtonLoading(false)
              })
          }
        } else {
          setErrorMessages(
            "İnstagrama giriş yaptığın hesap ile giriş yapmalısın"
          )
          setLoginButtonLoading(false)
        }
      })
      .catch(() => {
        setErrorMessages("Kullanıcı bulunamadı")
        setLoginButtonLoading(false)
      })
  }

  function setUsername(key: string) {
    username.current.value += key
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
            <InputError text={errorMessages} />
          </InputLayout>
          <Button loading={loginButtonLoading} onClick={() => loginUser()} big>
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
      {usersIndexedDB.map((user) => (
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
