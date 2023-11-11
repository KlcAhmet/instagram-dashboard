import { StrictMode } from "react"

import { Profile } from "~components/profile"
import config from "~config.json"

function IndexPage() {
  const { homePageProfile } = config.htmlClass

  return (
    <StrictMode>
      <Profile />
    </StrictMode>
  )
}

export default IndexPage