import { store } from "~store"
import { setConnected, setError } from "~store/indexedDbSlice"

const dbName = "instagram-dashboard-users"
const dbVersion = 1

let openRequest = window.indexedDB.open(dbName, dbVersion)

openRequest.onsuccess = () => {
  const db = openRequest.result
  console.log("DB Opened", openRequest.result)

  if (db.objectStoreNames.length !== 0) store.dispatch(setConnected(true))
}

openRequest.onupgradeneeded = () => {
  console.log("DB Upgrade Needed")
  const db = openRequest.result
  if (db.objectStoreNames.length === 0) {
    db.createObjectStore(dbName, { keyPath: "ds_user_id" })
  }
}

openRequest.onerror = () => {
  console.log("DB Error", openRequest.error)
  store.dispatch(setError(openRequest.error))
}

export async function getUsersIndexedDB(): Promise<any> {
  let response = new Promise((resolve, reject) => {
    const db = openRequest.result
    const transaction = db.transaction(dbName, "readwrite")
    const store = transaction.objectStore(dbName)
    const getAllRequest = store.getAll()

    getAllRequest.onsuccess = () => {
      console.log("getAllRequest DB onsuccess:", getAllRequest.result)
      resolve(getAllRequest.result)
    }

    getAllRequest.onerror = function () {
      console.error("getAllRequest DB Error", getAllRequest.error)
      reject(getAllRequest.error)
    }
  })
  return await response
}

export async function setUserIndexedDB(data: any) {
  let response = new Promise((resolve, reject) => {
    const db = openRequest.result
    const transaction = db.transaction(dbName, "readwrite")
    let users = transaction.objectStore(dbName)
    const request = users.add({
      ...data,
      ds_user_id: data.id,
      created_at: new Date().toISOString()
    })

    request.onsuccess = function () {
      console.log("User added to the store", request.result)
      resolve(request.result)
    }

    request.onerror = function () {
      console.log("setUserIndexedDB Error", request.error)
      reject(request.error)
    }
  })
  return await response
}

export async function updateUserIndexedDB(data: any) {
  let response = new Promise((resolve, reject) => {
    const db = openRequest.result
    const transaction = db.transaction(dbName, "readwrite")
    let users = transaction.objectStore(dbName)
    const request = users.put({
      ...data,
      ds_user_id: data.id,
      updated_at: new Date().toISOString()
    })

    request.onsuccess = function () {
      console.log("User added to the store", request.result)
      resolve(request.result)
    }

    request.onerror = function () {
      console.log("Error", request.error)
      reject(request.error)
    }
  })
  return await response
}
