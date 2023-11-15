import Icon from "data-base64:~assets/icon.png"
import XIcon from "data-base64:~assets/XIcon.png"
import { StrictMode, useState } from "react"

import { FollowList } from "~components/follow-list"
import { Profile } from "~components/profile"

function IndexPage() {
  const [activeProfile, setActiveProfile] = useState(false)
  const [activeFollowList, setActiveFollowList] = useState(false)

  return (
    <StrictMode>
      <div className="absolute inline bg-gray rounded-lg p-2 top-[70px] left-5">
        <div className="flex justify-end">
          <button
            className="w-6 h-6"
            onClick={() => setActiveProfile(!activeProfile)}>
            {activeProfile ? (
              <img src={XIcon} className="w-full h-full" alt="Xicon" />
            ) : (
              <img src={Icon} className="w-full h-full" alt="Iicon" />
            )}
          </button>
        </div>
        {activeProfile || activeFollowList ? (
          <div className="w-96 max-h-[80vh] overflow-y-scroll">
            {activeProfile ? <Profile /> : null}
            <button onClick={() => setActiveFollowList(!activeFollowList)}>
              {activeFollowList ? "close follow list" : "open follow list"}
            </button>
            {activeFollowList ? <FollowList /> : null}
          </div>
        ) : null}
      </div>
    </StrictMode>
  )
}

export default IndexPage