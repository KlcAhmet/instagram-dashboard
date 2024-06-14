import type { TFollowed, TUserList } from "~types"

export function getDifferenceUserLists(
  users: Array<TUserList>,
  lastUsersLog: Array<TUserList>
): Array<TFollowed> {
  if (!lastUsersLog.length) return []
  const mappedUsers = (
    arr1: Array<TUserList>,
    arr2: Array<TUserList>,
    status: "unfollowed" | "followed"
  ) =>
    arr1
      .filter((x) => !arr2.some((y) => y.pk === x.pk))
      .map(
        (user: TUserList): TFollowed => ({
          user,
          status: status,
          created_at: new Date().toISOString()
        })
      )

  return [
    ...mappedUsers(users, lastUsersLog, "followed"),
    ...mappedUsers(lastUsersLog, users, "unfollowed")
  ]
}

export const ListItemMap = (items: Array<TFollowed | TUserList | any>) =>
  items.map((item) => {
    if (item?.user) return item
    return { user: item }
  })
