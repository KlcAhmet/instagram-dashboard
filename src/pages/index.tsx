import { StrictMode, useState } from "react"
import { Provider } from "react-redux"

import "~indexedDB"

import { PersistGate } from "@plasmohq/redux-persist/integration/react"

import { Login } from "~components/login"
import { Profile } from "~components/profile"
import { index, persistor } from "~store"

import Icon from "../../assets/icon.png"
import XIcon from "../appassets/XIcon.png"


function IndexPage() {
  const [activeProfile, setActiveProfile] = useState(false)

  return (
    <StrictMode>
      <Provider store={index}>
        <PersistGate loading={null} persistor={persistor}>
          <div className="absolute inline bg-gray rounded-lg p-2 top-[70px] left-5">
            <div className="flex justify-end">
              <button
                className="w-6 h-6"
                onClick={() => setActiveProfile(!activeProfile)}>
                {activeProfile ? (
                  <img src={`${XIcon}`} className="w-full h-full" alt="Xicon" />
                ) : (
                  <img src={`${Icon}`} className="w-full h-full" alt="Iicon" />
                )}
              </button>
            </div>
            {activeProfile ? (
              <div className="min-w-[400px] max-h-[80vh] overflow-y-scroll">
                <Login />
                <Profile />
              </div>
            ) : null}
          </div>
        </PersistGate>
      </Provider>
    </StrictMode>
  )
}

export default IndexPage