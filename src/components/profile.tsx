import { useAppSelector } from "src/store"
import { type TUserProfile } from "src/types"

/*import { CompareList } from "~components/compare-list"*/
import { FollowerList } from "~components/follower-list"





/*import { FollowingList } from "~components/following-list"
import { LikedPosts } from "~components/liked-posts"*/

export function Profile() {
  const user: TUserProfile = useAppSelector((state) => state.user)
  return (
    <>
      <div>
        <div className="flex flex-row items-center">
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
        <div className="flex flex-nowrap">
          <FollowerList />
          {/*  <FollowingList />
          <CompareList />
          <LikedPosts />*/}
        </div>
      </div>
    </>
  )
}
