const indexedDBName = "instagram-dashboard"

let openRequest = window.indexedDB.open(indexedDBName, 1)

openRequest.onupgradeneeded = function () {
  let db = openRequest.result
  if (!db.objectStoreNames.contains(indexedDBName))
    db.createObjectStore(indexedDBName, { keyPath: "ds_user_id" })
}

openRequest.onsuccess = function () {
  console.log("DB onsuccess")
}

openRequest.onerror = function () {
  console.error("DB Error", openRequest.error)
}

export async function getUsersIndexedDB() {
  let response = new Promise((resolve, reject) => {
    const db = openRequest.result
    const transaction = db.transaction(indexedDBName, "readwrite")
    const store = transaction.objectStore(indexedDBName)
    const getAllRequest = store.getAll()

    getAllRequest.onsuccess = () => {
      console.log("getAllRequest DB onsuccess:", getAllRequest.result)
      resolve(getAllRequest.result)
    }

    getAllRequest.onerror = function () {
      reject(getAllRequest.error)
      console.error("getAllRequest DB Error", getAllRequest.error)
    }
  })
  return await response
}

export async function setUserIndexedDB(data: any) {
  let response = new Promise((resolve, reject) => {
    const db = openRequest.result
    const transaction = db.transaction(indexedDBName, "readwrite")
    let users = transaction.objectStore(indexedDBName)
    const request = users.add({
      ...data,
      ds_user_id: data.id,
      created_at: new Date()
    })

    request.onsuccess = function () {
      // (4)
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
