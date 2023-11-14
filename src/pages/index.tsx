import { StrictMode, useState } from "react"

import { FollowList } from "~components/follow-list"
import { Profile } from "~components/profile"

function IndexPage() {
  const [activeProfile, setActiveProfile] = useState(false)
  const [activeFollowList, setActiveFollowList] = useState(false)

  return (
    <StrictMode>
      <div className="absolute md:pr-10 inline bg-gray p-1">
        <div>
          <button onClick={() => setActiveProfile(!activeProfile)}>
            {activeProfile ? "close profile" : "open profile"}
          </button>
          <button onClick={() => setActiveFollowList(!activeFollowList)}>
            {activeFollowList ? "close follow list" : "open follow list"}
          </button>
        </div>
        {activeProfile ? <Profile /> : null}
        {activeFollowList ? <FollowList /> : null}
      </div>
    </StrictMode>
  )
}

export default IndexPage