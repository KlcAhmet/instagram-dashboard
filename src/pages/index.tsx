import { useState } from "react"
import { Provider } from "react-redux"

import "~indexedDB"

import { store } from "src/store"

import { Login } from "~components/login"
import { Profile } from "~components/profile"





function IndexPage() {
  const [activeProfile, setActiveProfile] = useState(false)

  return (
    <Provider store={store}>
      <div className="bg-black text-white w-screen h-screen">
        <Login />
        <Profile />
      </div>
    </Provider>
  )
}

export default IndexPage
