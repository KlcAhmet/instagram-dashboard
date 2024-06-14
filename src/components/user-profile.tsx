import type { TUserProfile } from "~types"

export function UserProfile({ ...user }: TUserProfile) {
  return (
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
          <div>
            <p>Biyografi: {user?.biography}</p>
          </div>
          <div>
            <p>
              hide like and view counts:{" "}
              {user?.hide_like_and_view_counts.toString()}
            </p>
          </div>
          <div>
            <p>is business account: {user?.is_business_account.toString()}</p>
          </div>
          <div>
            <p>is private: {user?.is_private.toString()}</p>
          </div>
          <div>
            <p>is verified: {user?.is_verified.toString()}</p>
          </div>
          <div>
            <p>
              edge_mutual_followed_by: (başka profil gösterildiğinde ortak
              takipçiler)
            </p>
          </div>
          <div>
            <p>is joined recently: {user?.is_joined_recently.toString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
