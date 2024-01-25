import { Provider } from "react-redux"
import { store, useAppSelector } from "src/store"

import "~indexedDB"

import { useState } from "react"

import { Loading, LoadingInfoText } from "~components/loading"
import { Login } from "~components/login"
import { Profile } from "~components/profile"





function IndexPage() {
  return (
    <>
      <Provider store={store}>
        <MainLayout />
      </Provider>
    </>
  )
}

function MainLayout() {
  const connected = useAppSelector((state) => state.indexedDb.connected)
  const [isLogin, setIsLogin] = useState(false)
  const Base = ({ children }) => {
    return (
      <div className="flex bg-charcoal text-white w-screen min-h-screen overscroll-y-auto overscroll-x-hidden">
        <div className="container mx-auto">{children}</div>
      </div>
    )
  }

  if (!connected) {
    return (
      <Base>
        <Loading imgClass="h-24" direction="column" animation>
          <LoadingInfoText
            text="Please wait..."
            className="mt-3 text-xl"
            animation
          />
        </Loading>
      </Base>
    )
  } else if (!isLogin) {
    return (
      <Base>
        <div className=" mt-48 flex justify-center">
          <Login isLogin={setIsLogin} />
        </div>
      </Base>
    )
  }
  return (
    <Base>
      <Profile />
    </Base>
  )
}

export default IndexPage
