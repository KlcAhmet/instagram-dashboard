import type { TFollowed, TLastUserLog, TUserList } from "~types"

export function findUnFollowedUsers(
  lastUserLog: TLastUserLog,
  users: Array<TUserList>,
  unFollowed: Array<TFollowed>
): Array<TFollowed> {
  const unfollowedUsers = lastUserLog.users.filter((user) => {
    return !users.find((u) => u.pk === user.pk)
  })
  const mappedUnfollowedUsers = unfollowedUsers
    .map((user: TUserList) => {
      return {
        user,
        status: "unfollowed",
        created_at: new Date().toISOString()
      }
    })
    .filter((user) => user !== null)
  mappedUnfollowedUsers.push(...unFollowed)

  return mappedUnfollowedUsers
}

export function findFollowedUsers(
  lastUserLog: TLastUserLog,
  users: Array<TUserList>,
  followed: Array<TFollowed>
): Array<TFollowed> {
  const followedUsers = users.filter((user) => {
    return !lastUserLog.users.find((u) => u.pk === user.pk)
  })

  const mappedFollowedUsers = followedUsers
    .map((user: TUserList) => {
      return {
        user,
        status: "followed",
        created_at: new Date().toISOString()
      }
    })
    .filter((user) => user !== null)
  mappedFollowedUsers.push(...followed)
  return mappedFollowedUsers
}

export const ListItemMap = (items: Array<TFollowed | TUserList | any>) =>
  items.map((item) => {
    if (item?.user) return item
    return { user: item }
  })