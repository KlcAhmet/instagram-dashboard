import type { ReactNode } from "react"

import type { TFollowed, TUserList } from "~types"





export function ListItem(item: TFollowed | TUserList | any) {
  const background = () => {
    if (item.status === "unfollowed") return "bg-red-800"
    else if (item.status === "followed") return "bg-green-800"
    else return "bg-blue-800"
  }
  const createdAt = item?.created_at
    ? new Date(item?.created_at).toISOString()
    : null

  return (
    <div
      className={
        "flex flex-nowrap items-stretch bg-navy rounded-xl overflow-hidden"
      }>
      <div className={`w-2 ${background()}`}></div>
      <div className="p-5 flex flex-row">
        <div className="shrink-0 mr-3">
          <img
            className="rounded-full w-16"
            src={item.user.profile_pic_url}
            alt="userimg"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col flex-grow ml-2">
          <p>{item.user.full_name}</p>
          <p>@{item.user.username}</p>
          <p>private: {`${item.user.is_private}`}</p>
          <p>verified: {`${item.user.is_verified}`}</p>
          {item?.status ? <p>Type: {item?.status}</p> : null}
          {item?.created_at ? <p className="">Time: {createdAt}</p> : null}
        </div>
      </div>
    </div>
  )
}

export const StatusBar = ({
  statusExecute,
  activeFollowList = true,
  count
}) => {
  return (
    <div>
      {activeFollowList ? (
        <div>
          <p>
            status {statusExecute} : {count}
          </p>
        </div>
      ) : (
        <div>
          <p>
            {statusExecute} : {count}
          </p>
        </div>
      )}
    </div>
  )
}

export function ListButton(props: object, children: ReactNode) {
  return (
    <button type="button" className="ml-2 border-2 border-blue-500" {...props}>
      {children}
    </button>
  )
}
