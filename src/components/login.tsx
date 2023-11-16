import { useEffect, useState } from 'react';



import { getUserProfile } from '~api';
import { indexedDBName } from '~config.json';
import { getAllCookies } from '~helpers';
import { useAppDispatch, useAppSelector } from '~store';
import { setUser, type TUserState } from '~store/userSlice';





// TODO: farklı hesap uyarısı ve hata mesajları
export function Login() {
  const dispatch = useAppDispatch()
  const user: TUserState = useAppSelector((state) => state.user)
  const cookieStore = getAllCookies()
  const [username, setUsername] = useState("wrappiezone")

  useEffect(() => {
    let openRequest = window.indexedDB.open(indexedDBName, 1)

    openRequest.onupgradeneeded = function () {
      let db = openRequest.result
      if (!db.objectStoreNames.contains(indexedDBName))
        db.createObjectStore(indexedDBName, { keyPath: "ds_user_id" })
    }

    openRequest.onerror = function () {
      console.error("DB Error", openRequest.error)
    }

    openRequest.onsuccess = function () {
      const db = openRequest.result
      const transaction = db.transaction(indexedDBName, "readwrite")
      const store = transaction.objectStore(indexedDBName)
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = () => {
        const allData = getAllRequest.result
        console.log("DB onsuccess:", allData)
      }

      getAllRequest.onerror = function () {
        console.error("DB Error", getAllRequest.error)
      }
    }
  }, [])

  function getUser() {
    getUserProfile(username).then((user) => {
      if (user.id === cookieStore.ds_user_id) {
        dispatch(setUser(user))
      }
    })
  }

  return (
    <>
      {!user.id ? (
        <div>
          <label>Username: </label>
          <input
            type="text"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="button" onClick={getUser}>
            Get User
          </button>
        </div>
      ) : null}
    </>
  )
}