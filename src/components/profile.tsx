import { useEffect, useState, useTransition } from "react"

/*import { CompareList } from "~components/compare-list"*/
import { FollowerList } from "~components/follower-list"





/*import { FollowingList } from "~components/following-list"
import { LikedPosts } from "~components/liked-posts"*/

export function Profile() {
  /*const user: TUserProfile = useAppSelector((state) => state.user)*/
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState("followers")

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab)
    })
  }

  useEffect(() => {
    console.log("isPending", isPending)
  }, [isPending])

  /*const [profileSection, setProfileSection] = useState(
    <UserProfile {...user} />
  )*/
  return (
    <div className="flex flex-row flex-nowrap">
      <div className="bg-navy p-6 min-w-[180px] mr-5">
        <ul className="space-y-2">
          <li>
            <span>Profile</span>
          </li>
          <li>
            <button onClick={() => selectTab("followers")}>Followers</button>
          </li>
          <li>
            <span>Following</span>
          </li>
          <li>
            <span>Compare</span>
          </li>
        </ul>
      </div>
      <div className="grow">
        {tab === "followers" && <FollowerList />}
        {/*<div className="w-full">{profileSection}</div>*/}
      </div>
    </div>
  )
  /* return (
     <>
       <div>
         <div className="bg-navy rounded-xl p-6 flex flex-row items-center">
           <img
             className="rounded-full w-24 h-24 mr-5"
             src={user.profile_pic_url}
             alt="profile"
             loading="lazy"
           />
           <div className="text-center">
             <h6 className="text-xl font-bold">{user.full_name}</h6>
             <p className="text-sm">{user.username}</p>
             <div className="flex justify-center space-x-2">
               <p>Takipçi: {user["edge_followed_by.count"]}</p>
               <p>Takip: {user["edge_follow.count"]}</p>
             </div>
           </div>
         </div>
         {/!*<div className="flex flex-nowrap">
           <FollowerList />
           <FollowingList />
           <CompareList />
           <LikedPosts />
         </div>*!/}
       </div>
     </>
   )*/
}
